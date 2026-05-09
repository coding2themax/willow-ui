import { useState, useEffect } from 'react'
import { Inquiry, STATUS_BADGE } from './types'
import { getInquiries, updateInquiryStatus, deleteInquiry as apiDeleteInquiry } from '../../api/inquiries'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

interface Props {
  inquiries: Inquiry[]
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>
  loading: boolean
  error: string | null
}

export default function InquiriesTab({ inquiries, setInquiries, loading, error }: Props) {
  const [expandedId,   setExpandedId]   = useState<number | null>(null)
  const [filterText,   setFilterText]   = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [tabError,     setTabError]     = useState<string | null>(null)

  const filtered = inquiries.filter(inq => {
    const text = (inq.name + inq.email).toLowerCase()
    return (!filterText || text.includes(filterText.toLowerCase()))
        && (!filterStatus || inq.status === filterStatus)
  })

  const newCount       = inquiries.filter(i => i.status === 'New').length
  const scheduledCount = inquiries.filter(i => i.status === 'Visit Scheduled').length
  const completeCount  = inquiries.filter(i => i.status === 'Visit Complete').length

  const updateStatus = async (id: number, status: string) => {
    try {
      const updated = await updateInquiryStatus(id, status)
      setInquiries(prev => prev.map(i => i.id === id ? updated : i))
    } catch (err) {
      setTabError(err instanceof Error ? err.message : 'Failed to update status.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteInquiry(id)
      setInquiries(prev => prev.filter(i => i.id !== id))
      if (expandedId === id) setExpandedId(null)
    } catch (err) {
      setTabError(err instanceof Error ? err.message : 'Failed to delete inquiry.')
    }
  }

  // Reload from API when tab mounts
  useEffect(() => {
    getInquiries()
      .then(setInquiries)
      .catch(() => { /* parent already surfaces load errors */ })
  }, [setInquiries])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '3rem', color: 'var(--text-mid)' }}>
        <Spinner /> Loading inquiries…
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Inquiries</div>
        </div>
      </div>

      {(error ?? tabError) && (
        <ErrorBanner
          message={(error ?? tabError)!}
          onDismiss={() => setTabError(null)}
        />
      )}

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-label">Total</div>
          <div className="stat-card-value">{inquiries.length}</div>
          <div className="stat-card-sub">All inquiries</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">New</div>
          <div className="stat-card-value">{newCount}</div>
          <div className="stat-card-sub">Awaiting response</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Visits Scheduled</div>
          <div className="stat-card-value">{scheduledCount}</div>
          <div className="stat-card-sub">Upcoming viewings</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Completed</div>
          <div className="stat-card-value">{completeCount}</div>
          <div className="stat-card-sub">Visits done</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <input
            className="table-search"
            type="text"
            placeholder="Search by name or email…"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
          <select
            className="table-filter"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Visit Scheduled</option>
            <option>Visit Complete</option>
          </select>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>Click a row to expand</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✉️</div>
            <div className="empty-title">No inquiries yet</div>
            <div className="empty-text">When someone fills out the form they'll appear here.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Experience</th><th>Use</th>
                <th>Source</th><th>Status</th><th>Date</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inq => {
                const isExpanded = expandedId === inq.id
                return [
                  <tr
                    key={inq.id}
                    className={isExpanded ? 'expanded' : ''}
                    onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                  >
                    <td className="name-cell">{inq.name}</td>
                    <td>{inq.email}</td>
                    <td>{inq.experience || '—'}</td>
                    <td>{inq.use || '—'}</td>
                    <td>{inq.source || '—'}</td>
                    <td><span className={`badge ${STATUS_BADGE[inq.status] ?? 'badge-new'}`}>{inq.status}</span></td>
                    <td>{inq.date}</td>
                    <td style={{ color: 'var(--gold)', fontSize: '1rem', paddingRight: '1.5rem' }}>
                      {isExpanded ? '▲' : '▼'}
                    </td>
                  </tr>,
                  isExpanded && (
                    <tr key={`${inq.id}-expand`} onClick={e => e.stopPropagation()}>
                      <td className="expand-cell" colSpan={8}>
                        <div className="expand-inner">
                          <div><div className="expand-label">Phone</div><div className="expand-value">{inq.phone || '—'}</div></div>
                          <div><div className="expand-label">Intended Use</div><div className="expand-value">{inq.use || '—'}</div></div>
                          <div><div className="expand-label">Setup</div><div className="expand-value">{inq.setup || '—'}</div></div>
                          <div className="expand-message">
                            <div className="expand-label">Message</div>
                            <div className="expand-value">"{inq.message || '—'}"</div>
                          </div>
                          <div className="expand-actions">
                            <span className="expand-status-label">Update Status</span>
                            <select
                              className="status-select"
                              value={inq.status}
                              onChange={e => updateStatus(inq.id, e.target.value)}
                            >
                              {['New', 'Contacted', 'Visit Scheduled', 'Visit Complete'].map(s => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                            <div style={{ flex: 1 }} />
                            <a href={`mailto:${inq.email}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                              Reply via Email
                            </a>
                            <button className="btn btn-ghost" onClick={() => handleDelete(inq.id)}>Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
