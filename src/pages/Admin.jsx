import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'

// ── Sample data ──────────────────────────────────────────────────────────────
const SAMPLES = [
  { name: 'Sarah Mitchell',  email: 'sarah.m@email.com',      phone: '(480) 555-0142', experience: 'Advanced',             use: 'Trail / Pleasure',    source: 'Facebook',      setup: '5-acre property, 3 other horses, private barn',       message: "I've been riding for 15 years and am looking for a gentle mare to trail ride. Willow sounds perfect — I love the draft temperament. Do you know her height?", date: 'May 2',  status: 'New',            id: 1 },
  { name: 'James Torres',    email: 'jtorres@horsepro.net',   phone: '(602) 555-0311', experience: 'Trainer / Professional', use: 'Project / Training',  source: 'DreamHorse',    setup: 'Training facility, 12 horses, arena',                 message: 'Professional trainer looking for a project. Draft crosses are my specialty. Would love to schedule a PPE and ride her if possible.',                             date: 'Apr 30', status: 'Contacted',       id: 2 },
  { name: 'Lisa Kaufmann',   email: 'lisa.k@gmail.com',       phone: '(480) 555-0889', experience: 'Intermediate',          use: 'Trail / Pleasure',    source: 'Instagram',     setup: 'Boarding stable nearby',                              message: "Willow is absolutely beautiful! I'm an intermediate rider looking for a calm, manageable horse. I'd love to come see her.",                                    date: 'Apr 28', status: 'Visit Scheduled', id: 3 },
  { name: 'Paul Reynolds',   email: 'p.reynolds@ranch.com',   phone: '(520) 555-0402', experience: 'Advanced',             use: 'Project / Training',  source: 'Word of mouth', setup: '15-acre ranch, 6 horses',                             message: "Heard about Willow from a mutual friend. Looking for a mare to breed and train. Would like to discuss her background further.",                                date: 'Apr 22', status: 'Visit Complete',  id: 4 },
]

const APPTS = [
  { name: 'Lisa Kaufmann', date: '10', month: 'May', time: '2:00 PM',  notes: 'Intermediate rider, boarding nearby',   status: 'pending' },
  { name: 'James Torres',  date: '14', month: 'May', time: '11:00 AM', notes: 'Professional trainer, PPE requested', status: 'approved' },
]

const STATUS_BADGE = {
  'New':            'badge-new',
  'Contacted':      'badge-contacted',
  'Visit Scheduled':'badge-scheduled',
  'Visit Complete': 'badge-complete',
}

// ── Sub-components ────────────────────────────────────────────────────────────
function InquiriesTab({ inquiries, setInquiries }) {
  const [expandedId,   setExpandedId]   = useState(null)
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

  const updateStatus = (id, status) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }
  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(i => i.id !== id))
    if (expandedId === id) setExpandedId(null)
  }
  const addSample = () => {
    const s = { ...SAMPLES[inquiries.length % SAMPLES.length], id: Date.now(), date: 'May 3' }
    setInquiries(prev => [s, ...prev])
  }
  const clearAll = () => {
    if (window.confirm('Clear all inquiries?')) {
      setInquiries([])
      setExpandedId(null)
    }
  }

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
                    <td><span className={`badge ${STATUS_BADGE[inq.status] || 'badge-new'}`}>{inq.status}</span></td>
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

function AppointmentsTab({ inquiries }) {
  const [appts, setAppts] = useState(() => {
    const scheduled = inquiries.filter(i => i.status === 'Visit Scheduled')
    return scheduled.length
      ? scheduled.map(inq => ({ name: inq.name, date: '—', month: '—', time: 'TBD', notes: inq.setup || '', status: 'pending' }))
      : APPTS
  })

  const approve = (i) => setAppts(prev => prev.map((a, idx) => idx === i ? { ...a, status: 'approved' } : a))
  const decline = (i) => setAppts(prev => prev.filter((_, idx) => idx !== i))

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

function GalleryTab() {
  const INITIAL = [
    { src: '/uploads/IMG_6728.jpeg', alt: 'Willow' },
    { src: '/uploads/IMG_5992.jpeg', alt: 'Willow' },
    { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow' },
  ]
  const [photos, setPhotos] = useState(INITIAL)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Gallery</div>
        </div>
        <div className="page-header-spacer" />
        <button className="btn btn-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Upload Photos
        </button>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
        Click ⭐ to feature a photo in the hero. Delete to remove from listing.
      </p>
      <div className="gallery-admin-grid">
        {photos.map((p, i) => (
          <div key={i} className="gallery-admin-item">
            <img src={p.src} alt={p.alt} />
            <div className="gallery-admin-overlay">
              <button className="gallery-admin-btn" title="Feature">⭐</button>
              <button className="gallery-admin-btn" title="Delete" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
            </div>
          </div>
        ))}
        <div className="gallery-upload-zone">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v12M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="gallery-upload-text">Upload Photo</div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab({ inquiries }) {
  const sources   = {}
  const exps      = {}
  const statuses  = { New: 0, Contacted: 0, 'Visit Scheduled': 0, 'Visit Complete': 0 }
  const thisWeek  = ['May 2', 'May 3', 'May 1', 'Apr 30']

  inquiries.forEach(i => {
    if (i.source)     sources[i.source]     = (sources[i.source]     || 0) + 1
    if (i.experience) exps[i.experience]    = (exps[i.experience]    || 0) + 1
    if (i.status in statuses) statuses[i.status]++
  })

  const maxS    = Math.max(...Object.values(sources), 1)
  const maxE    = Math.max(...Object.values(exps), 1)
  const topSrc  = Object.entries(sources).sort((a, b) => b[1] - a[1])[0]
  const weekCnt = inquiries.filter(i => thisWeek.includes(i.date)).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Analytics</div>
        </div>
      </div>

      <div className="stat-cards" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Inquiries</div>
          <div className="stat-card-value">{inquiries.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">This Week</div>
          <div className="stat-card-value">{weekCnt}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Avg Response</div>
          <div className="stat-card-value">—</div>
          <div className="stat-card-sub">Set manually</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Top Source</div>
          <div className="stat-card-value" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
            {topSrc ? topSrc[0] : '—'}
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-title">Inquiries by Source</div>
          <div className="bar-chart">
            {Object.keys(sources).length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(sources).map(([k, v]) => (
                <div key={k} className="bar-row">
                  <div className="bar-label">{k}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(v / maxS * 100)}%` }} /></div>
                  <div className="bar-val">{v}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-title">Inquiries by Experience Level</div>
          <div className="bar-chart">
            {Object.keys(exps).length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(exps).map(([k, v]) => (
                <div key={k} className="bar-row">
                  <div className="bar-label">{k}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.round(v / maxE * 100)}%`, background: '#8a6545' }} /></div>
                  <div className="bar-val">{v}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
          <div className="analytics-card-title">Status Breakdown</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {inquiries.length === 0
              ? <p className="analytics-empty">Submit an inquiry to see data.</p>
              : Object.entries(statuses).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${STATUS_BADGE[k]}`}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text)' }}>{v}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin component ──────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState('inquiries')
  const [inquiries, setInquiries] = useState(() =>
    JSON.parse(localStorage.getItem('willow_inquiries') || '[]')
  )

  useEffect(() => {
    localStorage.setItem('willow_inquiries', JSON.stringify(inquiries))
  }, [inquiries])

  const newCount = inquiries.filter(i => i.status === 'New').length || inquiries.length

  const tabs = [
    {
      id: 'inquiries',
      label: 'Inquiries',
      count: newCount,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 3h11M2 7h8M2 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2v2M10 2v2M2 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 10.5l3.5-3 3 2.5 2-1.5 3 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12l3-4 3 2 3-5 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
  ]

  return (
    <div className="admin-app">
      {/* TOP BAR */}
      <div className="topbar">
        <Link to="/" className="topbar-logo">Willow</Link>
        <span className="topbar-badge">Admin</span>
        <div className="topbar-spacer" />
        <span className="topbar-user">admin · coding2themax.com</span>
        <Link to="/" className="topbar-view-btn">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 2C3.5 2 1.8 3.3 1 5.5c.8 2.2 2.5 3.5 4.5 3.5s3.7-1.3 4.5-3.5C9.2 3.3 7.5 2 5.5 2z" stroke="currentColor" strokeWidth="1.1"/>
            <circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          View Listing
        </Link>
      </div>

      {/* BODY */}
      <div className="app-body">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-section-label">Dashboard</div>
          {tabs.map(t => (
            <div
              key={t.id}
              className={`sidebar-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              {t.label}
              {t.count != null && <span className="sidebar-count">{t.count}</span>}
            </div>
          ))}
          <div className="sidebar-section-label" style={{ marginTop: 'auto' }}>Listing</div>
          <div className="sidebar-item" style={{ marginBottom: '1rem' }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7.5 5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '0.75rem', color: 'rgba(184,130,42,0.6)' }}>Last updated: Today</span>
          </div>
        </nav>

        {/* MAIN */}
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
