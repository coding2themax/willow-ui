const TRAITS = [
  { label: 'Temperament',       value: 'Curious & Smart' },
  { label: 'Training',          value: 'Partially Started' },
  { label: 'Ideal For',         value: 'Trainer / Project' },
  { label: 'Pre-Purchase Exam', value: 'Welcome ✓' },
  { label: 'Loads & Ties',      value: 'Yes' },
  { label: 'Current on Care',   value: 'Yes' },
]

export default function AboutSection() {
  return (
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
  )
}
