interface Props {
  activeTab: string
  onTabChange: (id: string) => void
  newCount: number
}

const TABS = [
  {
    id: 'inquiries',
    label: 'Inquiries',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 3h11M2 7h8M2 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    showCount: true,
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2v2M10 2v2M2 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    showCount: false,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 10.5l3.5-3 3 2.5 2-1.5 3 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    showCount: false,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12l3-4 3 2 3-5 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    showCount: false,
  },
]

export default function AdminSidebar({ activeTab, onTabChange, newCount }: Props) {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Dashboard</div>
      {TABS.map(t => (
        <div
          key={t.id}
          className={`sidebar-item${activeTab === t.id ? ' active' : ''}`}
          onClick={() => onTabChange(t.id)}
        >
          {t.icon}
          {t.label}
          {t.showCount && newCount > 0 && <span className="sidebar-count">{newCount}</span>}
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
  )
}
