import { useState } from 'react'
import { createInquiry } from '../api/inquiries'
import Spinner from './ui/Spinner'
import ErrorBanner from './ui/ErrorBanner'

const IS_SOLD = import.meta.env.VITE_SOLD === 'true'

export default function InquirySection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {
      name:       fd.get('f-name')       as string,
      email:      fd.get('f-email')      as string,
      phone:      fd.get('f-phone')      as string | undefined,
      experience: fd.get('f-experience') as string | undefined,
      use:        fd.get('f-use')        as string | undefined,
      source:     fd.get('f-source')     as string | undefined,
      setup:      fd.get('f-setup')      as string | undefined,
      message:    fd.get('f-message')    as string | undefined,
    }

    setLoading(true)
    setError(null)

    try {
      await createInquiry(data)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
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
            {IS_SOLD ? (
              <div className="form-success">
                <div className="form-success-title">Willow Has Been Sold</div>
                <div className="form-success-text">
                  Thank you for your interest. Willow has found her new home.
                </div>
              </div>
            ) : submitted ? (
              <div className="form-success">
                <div className="form-success-title">Thank you!</div>
                <div className="form-success-text">
                  We've received your inquiry and will be in touch within 24–48 hours.
                </div>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
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
                <button type="submit" className="form-submit" disabled={loading}>
                  {loading ? <Spinner size={14} /> : null}
                  {loading ? 'Sending…' : 'Send Inquiry'}
                  {!loading && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
