import { apiFetch } from './client'
import type { Inquiry } from '../components/admin/types'

export interface CreateInquiryPayload {
  name: string
  email: string
  phone?: string
  experience?: string
  use?: string
  source?: string
  setup?: string
  message?: string
}

export const getInquiries = (): Promise<Inquiry[]> =>
  apiFetch<Inquiry[]>('/api/inquiries')

export const createInquiry = (data: CreateInquiryPayload): Promise<Inquiry> =>
  apiFetch<Inquiry>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateInquiryStatus = (id: number, status: string): Promise<Inquiry> =>
  apiFetch<Inquiry>(`/api/inquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })

export const deleteInquiry = (id: number): Promise<void> =>
  apiFetch<void>(`/api/inquiries/${id}`, { method: 'DELETE' })
