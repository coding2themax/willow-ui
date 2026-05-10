import { useState, useEffect } from 'react'
import { Appointment } from './types'
import { getAppointments, approveAppointment, declineAppointment } from '../../api/appointments'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

export default function AppointmentsTab() {
  const [appts,   setAppts]   = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    getAppointments()
      .then(setAppts)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load appointments.'))
      .finally(() => setLoading(false))
  }, [])

  const approve = async (id: number) => {
    try {
      const updated = await approveAppointment(id)
      setAppts(prev => prev.map(a => a.id === id ? updated : a))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve appointment.')
    }
  }

  const decline = async (id: number) => {
    try {
      await declineAppointment(id)
      setAppts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline appointment.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Appointments</div>
        </div>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3rem', color: 'var(--text-mid)' }}>
          <Spinner /> Loading appointments…
        </div>
      ) : appts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No appointments yet</div>
          <div className="empty-text">Upcoming visit requests will appear here.</div>
        </div>
      ) : (
        <div className="appt-list">
          {appts.map(a => (
            <div key={a.id} className="appt-card">
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
                <button className="btn-approve" onClick={() => approve(a.id)}>✓ Approve</button>
                <button className="btn-decline" onClick={() => decline(a.id)}>✕ Decline</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
