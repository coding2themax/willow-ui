import { useState } from 'react'
import { Inquiry, Appointment } from './types'

const APPTS: Appointment[] = [
  { name: 'Lisa Kaufmann', date: '10', month: 'May', time: '2:00 PM',  notes: 'Intermediate rider, boarding nearby', status: 'pending' },
  { name: 'James Torres',  date: '14', month: 'May', time: '11:00 AM', notes: 'Professional trainer, PPE requested', status: 'approved' },
]

interface Props {
  inquiries: Inquiry[]
}

export default function AppointmentsTab({ inquiries }: Props) {
  const [appts, setAppts] = useState<Appointment[]>(() => {
    const scheduled = inquiries.filter(i => i.status === 'Visit Scheduled')
    return scheduled.length
      ? scheduled.map(inq => ({ name: inq.name, date: '—', month: '—', time: 'TBD', notes: inq.setup ?? '', status: 'pending' as const }))
      : APPTS
  })

  const approve = (i: number) => setAppts(prev => prev.map((a, idx) => idx === i ? { ...a, status: 'approved' as const } : a))
  const decline = (i: number) => setAppts(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Appointments</div>
        </div>
      </div>
      {appts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No appointments yet</div>
          <div className="empty-text">Upcoming visit requests will appear here.</div>
        </div>
      ) : (
        <div className="appt-list">
          {appts.map((a, i) => (
            <div key={i} className="appt-card">
              <div className="appt-date">
                <div className="appt-date-day">{a.date}</div>
                <div className="appt-date-month">{a.month}</div>
              </div>
              <div className="appt-divider" />
              <div className="appt-info">
                <div className="appt-name">{a.name}</div>
                <div className="appt-meta">{a.time}{a.notes ? ` · ${a.notes}` : ''}</div>
              </div>
              <span className={`badge ${a.status === 'approved' ? 'badge-complete' : 'badge-contacted'}`}>
                {a.status}
              </span>
              <div className="appt-actions">
                <button className="btn-approve" onClick={() => approve(i)}>✓ Approve</button>
                <button className="btn-decline" onClick={() => decline(i)}>✕ Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
