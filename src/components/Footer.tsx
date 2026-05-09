import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [shareCopied, setShareCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  return (
    <footer>
      <div className="footer-name">Willow</div>
      <div className="footer-meta">
        Bay Draft Cross Mare &nbsp;·&nbsp; 3 Years Old &nbsp;·&nbsp; Chandler, Arizona<br />
        <span className="footer-gold">$3,500 OBO &nbsp;·&nbsp; Pre-purchase exam welcome</span><br />
        willow.coding2themax.com
      </div>
      <div className="footer-share">
        <button className="share-btn" onClick={copyLink}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="9.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="2.5" cy="6"   r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="9.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 6.8l4 2M4 5.2l4-2" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {shareCopied ? 'Copied!' : 'Share Link'}
        </button>
        <Link to="/admin" className="share-btn" style={{ textDecoration: 'none' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Admin
        </Link>
        <Link to="/progress" className="share-btn" style={{ textDecoration: 'none' }}>
          Progress
        </Link>
      </div>
      <div className="footer-copy">© 2026 · All rights reserved</div>
    </footer>
  )
}
