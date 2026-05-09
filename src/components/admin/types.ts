export interface Inquiry {
  id: number
  name: string
  email: string
  phone?: string
  experience?: string
  use?: string
  source?: string
  setup?: string
  message?: string
  date: string
  status: string
}

export interface Appointment {
  id: number
  name: string
  date: string
  month: string
  time: string
  notes: string
  status: 'pending' | 'approved'
}

export interface Photo {
  id: string
  src: string
  alt: string
  featured?: boolean
}

export const STATUS_BADGE: Record<string, string> = {
  'New':             'badge-new',
  'Contacted':       'badge-contacted',
  'Visit Scheduled': 'badge-scheduled',
  'Visit Complete':  'badge-complete',
}
