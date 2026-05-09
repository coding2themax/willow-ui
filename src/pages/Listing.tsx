import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Listing.css'

interface StatItem {
  label: string
  value: string
}

interface GalleryItem {
  src: string
  alt: string
  featured?: boolean
  style?: React.CSSProperties
}

interface LightboxState {
  open: boolean
  src: string
}

const STATS: StatItem[] = [
  { label: 'Age',      value: '3 Years' },
  { label: 'Breed',    value: 'Draft Cross' },
  { label: 'Color',    value: 'Bay' },
  { label: 'Sex',      value: 'Mare' },
  { label: 'Location', value: 'Chandler, AZ' },
  { label: 'Price',    value: '$3,500 OBO' },
]

const TRAITS: StatItem[] = [
  { label: 'Temperament',       value: 'Curious & Smart' },
  { label: 'Training',          value: 'Partially Started' },
  { label: 'Ideal For',         value: 'Trainer / Project' },
  { label: 'Pre-Purchase Exam', value: 'Welcome ✓' },
  { label: 'Loads & Ties',      value: 'Yes' },
  { label: 'Current on Care',   value: 'Yes' },
]

const GALLERY: GalleryItem[] = [
  { src: '/uploads/IMG_6728.jpeg',                                          alt: 'Willow full body',  featured: true },
  { src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow grazing' },
  { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow close-up' },
  { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow detail',    style: { objectPosition: 'center 20%' } },
  { src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow in field',  style: { objectPosition: 'center 60%' } },
]

export default function Listing() {
  const heroRef = useRef<HTMLElement>(null)
  const skyRef  = useRef<HTMLDivElement>(null)
  const bgRef   = useRef<HTMLDivElement>(null)
  const midRef  = useRef<HTMLDivElement>(null)
  const fgRef   = useRef<HTMLDivElement>(null)

  const [lightbox,    setLightbox]    = useState<LightboxState>({ open: false, src: '' })
  const [submitted,   setSubmitted]   = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  // Parallax scroll
  useEffect(() => {
    const layers: { ref: React.RefObject<HTMLDivElement | null>; speed: number }[] = [
      { ref: skyRef, speed: 0.5  },
      { ref: bgRef,  speed: 0.32 },
      { ref: midRef, speed: 0.16 },
      { ref: fgRef,  speed: 0.05 },
    ]
    let rafId: number | null = null
    const update = () => {
      const scrollY = window.pageYOffset
      const heroH   = heroRef.current?.offsetHeight ?? 0
      if (scrollY <= heroH) {
        layers.forEach(({ ref, speed }) => {
          if (ref.current) ref.current.style.transform = `translateY(${scrollY * speed}px)`
        })
      }
      rafId = null
    }
    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Fade-up on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Lightbox keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const openLightbox = (src: string) => {
    setLightbox({ open: true, src })
    document.body.style.overflow = 'hidden'
  }
  const closeLightbox = () => {
    setLightbox({ open: false, src: '' })
    document.body.style.overflow = ''
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name:       fd.get('f-name'),
      email:      fd.get('f-email'),
      phone:      fd.get('f-phone'),
      experience: fd.get('f-experience'),
      use:        fd.get('f-use'),
      source:     fd.get('f-source'),
      setup:      fd.get('f-setup'),
      message:    fd.get('f-message'),
      date:   new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'New',
      id:     Date.now(),
    }
    const existing = JSON.parse(localStorage.getItem('willow_inquiries') || '[]') as unknown[]
    existing.unshift(data)
    localStorage.setItem('willow_inquiries', JSON.stringify(existing))
    setSubmitted(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    })
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#top" className="nav-logo">Willow</a>
        <div className="nav-spacer" />
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#video">Video</a>
          <a href="#inquiry" className="nav-cta">Inquire</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="top" ref={heroRef}>
        <div className="plx-layer plx-sky" ref={skyRef} />
        <div className="plx-layer plx-bg"  ref={bgRef} />
        <div className="plx-layer plx-mid" ref={midRef} />
        <div className="plx-layer plx-fg"  ref={fgRef} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-eyebrow">Chandler, Arizona · For Sale</div>
            <div className="hero-name">Willow</div>
            <div className="hero-sub">Bay Draft Cross Mare &nbsp;·&nbsp; 3 Years Old</div>
          </div>
          <div className="hero-right">
            <div className="hero-price">$3,500</div>
            <div className="hero-price-note">OBO · PPE Welcome</div>
            <a href="#inquiry" className="hero-cta">
              Inquire
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map(s => (
            <div key={s.label} className="stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="section-inner">
          <div className="fade-up">
            <div className="section-eyebrow">About Her</div>
            <div className="section-title">Meet Willow</div>
            <div className="rule" />
          </div>
          <div className="about-grid fade-up">
            <div className="about-photo-wrap">
              <img className="about-photo" src="/uploads/IMG_5992.jpeg" alt="Willow grazing" />
              <div className="about-photo-accent" />
            </div>
            <div className="about-body">
              <p className="about-text">
                Willow is a stunning bay Draft Cross mare with a wide blaze and the kind of gentle,
                intelligent eye that tells you everything you need to know about her personality.
              </p>
              <p className="about-text">
                At three years old, she's been partially started under saddle and is ready for a
                patient, experienced rider to continue her journey. She carries all the classic draft
                temperament — calm, curious, people-oriented, and easy to handle on the ground.
              </p>
              <p className="about-text">
                She loads, ties, and is current on all care. Pre-purchase exam is welcome and
                encouraged. We're looking for the right home, not just the right price.
              </p>
              <div className="traits">
                {TRAITS.map(t => (
                  <div key={t.label} className="trait">
                    <div className="trait-label">{t.label}</div>
                    <div className="trait-value">{t.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery-section">
        <div className="section-inner">
          <div className="fade-up">
            <div className="section-eyebrow">Gallery</div>
            <div className="section-title">Photos of Willow</div>
            <div className="rule" />
          </div>
          <div className="gallery-grid fade-up">
            {GALLERY.map((item, i) => (
              <div
                key={i}
                className={`gallery-item${item.featured ? ' featured' : ''}`}
                onClick={() => openLightbox(item.src)}
              >
                <img src={item.src} alt={item.alt} style={item.style} />
                <div className="gallery-overlay" />
              </div>
            ))}
          </div>
          <p className="gallery-note">More photos available upon request.</p>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <img src={lightbox.src} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* VIDEO */}
      <section id="video" className="video-section">
        <div className="section-inner">
          <div className="fade-up">
            <div className="section-eyebrow">See Her Move</div>
            <div className="section-title">Willow in Motion</div>
            <div className="rule" />
            <p className="video-desc">
              Watch Willow move at liberty and under saddle. Her natural carriage and soft movement
              speak for themselves.
            </p>
          </div>
          <div className="video-wrap fade-up">
            <div className="video-placeholder">
              <div className="video-placeholder-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M10 8l12 6-12 6V8z" fill="rgba(184,130,42,0.5)" />
                </svg>
              </div>
              <div className="video-placeholder-text">Video coming soon</div>
            </div>
          </div>
          <p className="video-upload-hint">Drop willow.mp4 into /public to activate this section</p>
        </div>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="inquiry-section">
        <div className="section-inner">
          <div className="fade-up">
            <div className="section-eyebrow">Get in Touch</div>
            <div className="section-title">Interested in Willow?</div>
            <div className="rule" />
          </div>
          <div className="inquiry-grid fade-up">
            <div className="inquiry-intro">
              <p className="about-text">
                We're looking for the right match for Willow — a patient, experienced home where
                she can grow and thrive. If that sounds like you, we'd love to hear from you.
              </p>
              <ul className="inquiry-bullets">
                <li>Tell us about your experience and riding background</li>
                <li>Share what you're looking for in a horse</li>
                <li>Let us know your setup — barn, acreage, other horses</li>
                <li>Ask any questions you have about Willow</li>
              </ul>
              <div className="rule" style={{ marginTop: '2rem' }} />
              <p className="inquiry-footer-note">
                Located in Chandler, Arizona. Viewings by appointment only. Pre-purchase exam
                welcome and encouraged.
              </p>
            </div>

            <div>
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-title">Thank you!</div>
                  <div className="form-success-text">
                    We've received your inquiry and will be in touch within 24–48 hours.
                  </div>
                </div>
              ) : (
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-name">Name *</label>
                      <input className="form-input" id="f-name" name="f-name" type="text" required placeholder="Your full name" />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-email">Email *</label>
                      <input className="form-input" id="f-email" name="f-email" type="email" required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-phone">Phone</label>
                      <input className="form-input" id="f-phone" name="f-phone" type="tel" placeholder="(555) 000-0000" />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-experience">Experience Level *</label>
                      <select className="form-select form-input" id="f-experience" name="f-experience" required defaultValue="">
                        <option value="" disabled>Select…</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Trainer / Professional</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-use">Intended Use</label>
                      <select className="form-select form-input" id="f-use" name="f-use" defaultValue="">
                        <option value="" disabled>Select…</option>
                        <option>Trail / Pleasure</option>
                        <option>Project / Training</option>
                        <option>Sport / Competition</option>
                        <option>Breeding</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="f-source">How Did You Find Us?</label>
                      <select className="form-select form-input" id="f-source" name="f-source" defaultValue="">
                        <option value="" disabled>Select…</option>
                        <option>DreamHorse</option>
                        <option>Facebook</option>
                        <option>Instagram</option>
                        <option>Equine.com</option>
                        <option>Word of mouth</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-field full">
                    <label className="form-label" htmlFor="f-setup">Your Setup</label>
                    <input className="form-input" id="f-setup" name="f-setup" type="text" placeholder="Barn, acreage, other horses…" />
                  </div>
                  <div className="form-field full">
                    <label className="form-label" htmlFor="f-message">Message *</label>
                    <textarea className="form-textarea" id="f-message" name="f-message" required placeholder="Tell us about yourself and why Willow might be a good fit…" />
                  </div>
                  <button type="submit" className="form-submit">
                    Send Inquiry
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
        </div>
        <div className="footer-copy">© 2026 · All rights reserved</div>
      </footer>
    </>
  )
}
