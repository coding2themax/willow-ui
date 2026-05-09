import { Link } from 'react-router-dom'

export default function AdminTopbar() {
  return (
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
  )
}
