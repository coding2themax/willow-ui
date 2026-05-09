import { useState } from 'react'

interface Photo {
  src: string
  alt: string
}

const INITIAL_PHOTOS: Photo[] = [
  { src: '/uploads/IMG_6728.jpeg',                                          alt: 'Willow' },
  { src: '/uploads/IMG_5992.jpeg',                                          alt: 'Willow' },
  { src: '/uploads/77017896598__8B93C3A6-0343-438B-A019-095AABED8D24.jpeg', alt: 'Willow' },
]

export default function GalleryTab() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS)

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
