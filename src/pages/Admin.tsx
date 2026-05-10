import { useState, useEffect } from 'react'
import { Inquiry } from '../components/admin/types'
import { getInquiries } from '../api/inquiries'
import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'
import InquiriesTab from '../components/admin/InquiriesTab'
import AppointmentsTab from '../components/admin/AppointmentsTab'
import GalleryTab from '../components/admin/GalleryTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import LoginGate from '../components/admin/LoginGate'
import './Admin.css'

export default function Admin() {
  const [tab,       setTab]       = useState('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    getInquiries()
      .then(setInquiries)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load inquiries.'))
      .finally(() => setLoading(false))
  }, [])

  const newCount = inquiries.filter(i => i.status === 'New').length

  return (
    <LoginGate>
      <div className="admin-app">
        <AdminTopbar />
        <div className="app-body">
          <AdminSidebar activeTab={tab} onTabChange={setTab} newCount={newCount} />
          <main className="main">
            {tab === 'inquiries'    && (
              <InquiriesTab
                inquiries={inquiries}
                setInquiries={setInquiries}
                loading={loading}
                error={error}
              />
            )}
            {tab === 'appointments' && <AppointmentsTab />}
            {tab === 'gallery'      && <GalleryTab />}
            {tab === 'analytics'    && <AnalyticsTab />}
          </main>
        </div>
      </div>
    </LoginGate>
  )
}
