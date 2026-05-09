import { useState } from 'react'
import { Inquiry, STATUS_BADGE } from './types'

const SAMPLES: Inquiry[] = [
  { name: 'Sarah Mitchell',  email: 'sarah.m@email.com',      phone: '(480) 555-0142', experience: 'Advanced',               use: 'Trail / Pleasure',   source: 'Facebook',      setup: '5-acre property, 3 other horses, private barn',  message: "I've been riding for 15 years and am looking for a gentle mare to trail ride. Willow sounds perfect — I love the draft temperament. Do you know her height?", date: 'May 2',  status: 'New',            id: 1 },
  { name: 'James Torres',    email: 'jtorres@horsepro.net',   phone: '(602) 555-0311', experience: 'Trainer / Professional', use: 'Project / Training', source: 'DreamHorse',    setup: 'Training facility, 12 horses, arena',            message: 'Professional trainer looking for a project. Draft crosses are my specialty. Would love to schedule a PPE and ride her if possible.',                             date: 'Apr 30', status: 'Contacted',       id: 2 },
  { name: 'Lisa Kaufmann',   email: 'lisa.k@gmail.com',       phone: '(480) 555-0889', experience: 'Intermediate',           use: 'Trail / Pleasure',   source: 'Instagram',     setup: 'Boarding stable nearby',                         message: "Willow is absolutely beautiful! I'm an intermediate rider looking for a calm, manageable horse. I'd love to come see her.",                                    date: 'Apr 28', status: 'Visit Scheduled', id: 3 },
  { name: 'Paul Reynolds',   email: 'p.reynolds@ranch.com',   phone: '(520) 555-0402', experience: 'Advanced',               use: 'Project / Training', source: 'Word of mouth', setup: '15-acre ranch, 6 horses',                        message: "Heard about Willow from a mutual friend. Looking for a mare to breed and train. Would like to discuss her background further.",                                date: 'Apr 22', status: 'Visit Complete',  id: 4 },
]

interface Props {
  inquiries: Inquiry[]
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>
}

export default function InquiriesTab({ inquiries, setInquiries }: Props) {
  const [expandedId,   setExpandedId]   = useState<number | null>(null)
  const [filterText,   setFilterText]   = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = inquiries.filter(inq => {
    const text = (inq.name + inq.email).toLowerCase()
    return (!filterText || text.includes(filterText.toLowerCase()))
        && (!filterStatus || inq.status === filterStatus)
  })

  const newCount       = inquiries.filter(i => i.status === 'New').length
  const scheduledCount = inquiries.filter(i => i.status === 'Visit Scheduled').length
  const completeCount  = inquiries.filter(i => i.status === 'Visit Complete').length

  const updateStatus  = (id: number, status: string) => setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  const deleteInquiry = (id: number) => { setInquiries(prev => prev.filter(i => i.id !== id)); if (expandedId === id) setExpandedId(null) }
  const addSample     = () => { const s = { ...SAMPLES[inquiries.length % SAMPLES.length], id: Date.now(), date: 'May 3' }; setInquiries(prev => [s, ...prev]) }
  const clearAll      = () => { if (window.confirm('Clear all inquiries?')) { setInquiries([]); setExpandedId(null) } }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Inquiries</div>
        </div>
        <div className="page-header-spacer" />
        <button className="btn btn-secondary" onClick={addSample}>+ Add Sample</button>
        <button className="btn btn-ghost" onClick={clearAll}>Clear All</button>
      </div>

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
            <button className="btn btn-primary" style={{ margin: '1.5rem auto 0', display: 'flex' }} onClick={addSample}>
              + Add Sample Inquiry
            </button>
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
                            <button className="btn btn-ghost" onClick={() => deleteInquiry(inq.id)}>Delete</button>
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
