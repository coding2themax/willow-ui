import { apiFetch } from './client'
import type { Photo } from '../components/admin/types'

export const getPhotos = (): Promise<Photo[]> =>
  apiFetch<Photo[]>('/api/gallery')

export const uploadPhoto = (file: File): Promise<Photo> => {
  const fd = new FormData()
  fd.append('photo', file)
  return apiFetch<Photo>('/api/gallery', {
    method: 'POST',
    body: fd,
    isMultipart: true,
  })
}

export const deletePhoto = (id: string): Promise<void> =>
  apiFetch<void>(`/api/gallery/${id}`, { method: 'DELETE' })

export const featurePhoto = (id: string): Promise<Photo> =>
  apiFetch<Photo>(`/api/gallery/${id}/feature`, { method: 'POST' })
