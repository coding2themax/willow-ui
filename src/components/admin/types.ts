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
  name: string
  date: string
  month: string
  time: string
  notes: string
  status: 'pending' | 'approved'
}

export const STATUS_BADGE: Record<string, string> = {
  'New':             'badge-new',
  'Contacted':       'badge-contacted',
  'Visit Scheduled': 'badge-scheduled',
  'Visit Complete':  'badge-complete',
}
