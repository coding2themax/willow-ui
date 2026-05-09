import { apiFetch } from './client'
import type { Appointment } from '../components/admin/types'

export const getAppointments = (): Promise<Appointment[]> =>
  apiFetch<Appointment[]>('/api/appointments')

export const approveAppointment = (id: number): Promise<Appointment> =>
  apiFetch<Appointment>(`/api/appointments/${id}/approve`, { method: 'POST' })

export const declineAppointment = (id: number): Promise<void> =>
  apiFetch<void>(`/api/appointments/${id}/decline`, { method: 'POST' })
