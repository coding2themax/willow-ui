import { useState, useEffect } from 'react'
import { getPhotos } from '../api/gallery'
import type { Photo } from './admin/types'

const FALLBACK_GALLERY: Photo[] = [
  { id: 'f1', src: '/uploads/IMG_6728.jpeg',                                          alt: 'Willow full body',  featured: true },
  { id: 'f2', src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow grazing' },
  { id: 'f3', src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow close-up' },
  { id: 'f4', src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow detail' },
  { id: 'f5', src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow in field' },
]

interface Props {
  onOpen: (src: string) => void
}

export default function GallerySection({ onOpen }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(FALLBACK_GALLERY)

  useEffect(() => {
    getPhotos()
      .then(data => { if (data.length > 0) setPhotos(data) })
      .catch(() => { /* keep fallback */ })
  }, [])

  // Ensure one featured photo is first; pad if needed using non-featured items
  const featured   = photos.filter(p => p.featured)
  const rest       = photos.filter(p => !p.featured)
  const displaySet = featured.length > 0
    ? [featured[0], ...rest.slice(0, 4)]
    : photos.slice(0, 5)

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-inner">
        <div className="fade-up">
          <div className="section-eyebrow">Gallery</div>
          <div className="section-title">Photos of Willow</div>
          <div className="rule" />
        </div>
        <div className="gallery-grid fade-up">
          {displaySet.map((item, i) => (
            <div
              key={item.id}
              className={`gallery-item${i === 0 ? ' featured' : ''}`}
              onClick={() => onOpen(item.src)}
            >
              <img src={item.src} alt={item.alt} />
              <div className="gallery-overlay" />
            </div>
          ))}
        </div>
        <p className="gallery-note">More photos available upon request.</p>
      </div>
    </section>
  )
}
