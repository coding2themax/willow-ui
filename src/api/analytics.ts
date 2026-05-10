import { apiFetch } from './client'
import type { Inquiry } from '../components/admin/types'

export interface AnalyticsData {
  inquiries: Inquiry[]
}

export const getAnalytics = (): Promise<AnalyticsData> =>
  apiFetch<AnalyticsData>('/api/analytics')
