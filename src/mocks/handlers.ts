import { http, HttpResponse } from 'msw'
import type { Inquiry, Appointment, Photo } from '../components/admin/types'

// ── Seed data ────────────────────────────────────────────────────────────────

let inquiries: Inquiry[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    phone: '(480) 555-0142',
    experience: 'Advanced',
    use: 'Trail / Pleasure',
    source: 'Facebook',
    setup: '5-acre property, 3 other horses, private barn',
    message: "I've been riding for 15 years and am looking for a gentle mare to trail ride. Willow sounds perfect.",
    date: 'May 2',
    status: 'New',
  },
  {
    id: 2,
    name: 'James Torres',
    email: 'jtorres@horsepro.net',
    phone: '(602) 555-0311',
    experience: 'Trainer / Professional',
    use: 'Project / Training',
    source: 'DreamHorse',
    setup: 'Training facility, 12 horses, arena',
    message: 'Professional trainer looking for a project. Draft crosses are my specialty.',
    date: 'Apr 30',
    status: 'Contacted',
  },
  {
    id: 3,
    name: 'Lisa Kaufmann',
    email: 'lisa.k@gmail.com',
    phone: '(480) 555-0889',
    experience: 'Intermediate',
    use: 'Trail / Pleasure',
    source: 'Instagram',
    setup: 'Boarding stable nearby',
    message: "Willow is absolutely beautiful! I'd love to come see her.",
    date: 'Apr 28',
    status: 'Visit Scheduled',
  },
]

let appointments: Appointment[] = [
  {
    id: 1,
    name: 'Lisa Kaufmann',
    date: '10',
    month: 'May',
    time: '2:00 PM',
    notes: 'Intermediate rider, boarding nearby',
    status: 'pending',
  },
  {
    id: 2,
    name: 'James Torres',
    date: '14',
    month: 'May',
    time: '11:00 AM',
    notes: 'Professional trainer, PPE requested',
    status: 'approved',
  },
]

let photos: Photo[] = [
  { id: '1', src: '/uploads/IMG_6728.jpeg',                                          alt: 'Willow full body',  featured: true },
  { id: '2', src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow grazing' },
  { id: '3', src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow close-up' },
]

// ── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [
  // Inquiries
  http.get('/api/inquiries', () => HttpResponse.json(inquiries)),

  http.post('/api/inquiries', async ({ request }) => {
    const body = await request.json() as Omit<Inquiry, 'id' | 'date' | 'status'>
    const inquiry: Inquiry = {
      ...body,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'New',
    }
    inquiries = [inquiry, ...inquiries]
    return HttpResponse.json(inquiry, { status: 201 })
  }),

  http.patch('/api/inquiries/:id/status', async ({ params, request }) => {
    const id = Number(params['id'])
    const { status } = await request.json() as { status: string }
    inquiries = inquiries.map(i => i.id === id ? { ...i, status } : i)
    const updated = inquiries.find(i => i.id === id)
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  }),

  http.delete('/api/inquiries/:id', ({ params }) => {
    const id = Number(params['id'])
    inquiries = inquiries.filter(i => i.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // Appointments
  http.get('/api/appointments', () => HttpResponse.json(appointments)),

  http.post('/api/appointments/:id/approve', ({ params }) => {
    const id = Number(params['id'])
    appointments = appointments.map(a => a.id === id ? { ...a, status: 'approved' as const } : a)
    const updated = appointments.find(a => a.id === id)
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  }),

  http.post('/api/appointments/:id/decline', ({ params }) => {
    const id = Number(params['id'])
    appointments = appointments.filter(a => a.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  // Gallery
  http.get('/api/gallery', () => HttpResponse.json(photos)),

  http.post('/api/gallery', async ({ request }) => {
    const fd = await request.formData()
    const file = fd.get('photo') as File | null
    const photo: Photo = {
      id: String(Date.now()),
      src: file ? URL.createObjectURL(file) : '/uploads/placeholder.jpg',
      alt: file?.name ?? 'Uploaded photo',
    }
    photos = [...photos, photo]
    return HttpResponse.json(photo, { status: 201 })
  }),

  http.delete('/api/gallery/:id', ({ params }) => {
    const id = params['id'] as string
    photos = photos.filter(p => p.id !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/gallery/:id/feature', ({ params }) => {
    const id = params['id'] as string
    photos = photos.map(p => ({ ...p, featured: p.id === id }))
    const updated = photos.find(p => p.id === id)
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  }),

  // Analytics
  http.get('/api/analytics', () => HttpResponse.json({ inquiries })),
]
