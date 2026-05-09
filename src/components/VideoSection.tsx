export default function VideoSection() {
  return (
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
  )
}
