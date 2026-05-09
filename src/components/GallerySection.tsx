interface GalleryItem {
  src: string
  alt: string
  featured?: boolean
  style?: React.CSSProperties
}

const GALLERY: GalleryItem[] = [
  { src: '/uploads/IMG_6728.jpeg',                                          alt: 'Willow full body',  featured: true },
  { src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow grazing' },
  { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow close-up' },
  { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow detail',    style: { objectPosition: 'center 20%' } },
  { src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow in field',  style: { objectPosition: 'center 60%' } },
]

interface Props {
  onOpen: (src: string) => void
}

export default function GallerySection({ onOpen }: Props) {
  return (
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
              onClick={() => onOpen(item.src)}
            >
              <img src={item.src} alt={item.alt} style={item.style} />
              <div className="gallery-overlay" />
            </div>
          ))}
        </div>
        <p className="gallery-note">More photos available upon request.</p>
      </div>
    </section>
  )
}
