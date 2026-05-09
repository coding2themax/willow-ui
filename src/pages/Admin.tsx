import { useState, useEffect } from 'react'
import { Inquiry } from '../components/admin/types'
import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'
import InquiriesTab from '../components/admin/InquiriesTab'
import AppointmentsTab from '../components/admin/AppointmentsTab'
import GalleryTab from '../components/admin/GalleryTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import './Admin.css'

export default function Admin() {
  const [tab, setTab] = useState('inquiries')
  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    JSON.parse(localStorage.getItem('willow_inquiries') ?? '[]') as Inquiry[]
  )

  useEffect(() => {
    localStorage.setItem('willow_inquiries', JSON.stringify(inquiries))
  }, [inquiries])

  const newCount = inquiries.filter(i => i.status === 'New').length || inquiries.length

  return (
    <div className="admin-app">
      <AdminTopbar />
      <div className="app-body">
        <AdminSidebar activeTab={tab} onTabChange={setTab} newCount={newCount} />
        <main className="main">
          {tab === 'inquiries'    && <InquiriesTab    inquiries={inquiries} setInquiries={setInquiries} />}
          {tab === 'appointments' && <AppointmentsTab inquiries={inquiries} />}
          {tab === 'gallery'      && <GalleryTab />}
          {tab === 'analytics'    && <AnalyticsTab    inquiries={inquiries} />}
        </main>
      </div>
    </div>
  )
}
