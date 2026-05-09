import { useState, useEffect, useRef } from 'react'
import { Photo } from './types'
import { getPhotos, uploadPhoto, deletePhoto, featurePhoto } from '../../api/gallery'
import Spinner from '../ui/Spinner'
import ErrorBanner from '../ui/ErrorBanner'

export default function GalleryTab() {
  const [photos,    setPhotos]    = useState<Photo[]>([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getPhotos()
      .then(setPhotos)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load photos.'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const photo = await uploadPhoto(file)
      setPhotos(prev => [...prev, photo])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { void handleUpload(file) }
    // reset so the same file can be re-uploaded
    e.target.value = ''
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePhoto(id)
      setPhotos(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete photo.')
    }
  }

  const handleFeature = async (id: string) => {
    try {
      const updated = await featurePhoto(id)
      setPhotos(prev => prev.map(p => ({ ...p, featured: p.id === updated.id ? true : false })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to feature photo.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Willow</div>
          <div className="page-title">Gallery</div>
        </div>
        <div className="page-header-spacer" />
        <button
          className="btn btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Spinner size={12} /> : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
          {uploading ? 'Uploading…' : 'Upload Photos'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1rem', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
        Click ⭐ to feature a photo in the hero. Delete to remove from listing.
      </p>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2rem', color: 'var(--text-mid)' }}>
          <Spinner /> Loading gallery…
        </div>
      ) : (
        <div className="gallery-admin-grid">
          {photos.map(p => (
            <div key={p.id} className="gallery-admin-item">
              <img src={p.src} alt={p.alt} />
              <div className="gallery-admin-overlay">
                <button
                  className="gallery-admin-btn"
                  title={p.featured ? 'Featured' : 'Feature'}
                  onClick={() => handleFeature(p.id)}
                  style={{ background: p.featured ? 'rgba(184,130,42,0.9)' : undefined }}
                >
                  ⭐
                </button>
                <button
                  className="gallery-admin-btn"
                  title="Delete"
                  onClick={() => handleDelete(p.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <div
            className="gallery-upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v12M7 9l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div className="gallery-upload-text">Upload Photo</div>
          </div>
        </div>
      )}
    </div>
  )
}
