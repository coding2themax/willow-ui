import { useEffect } from 'react'

interface Props {
  src: string
  onClose: () => void
}

export default function Lightbox({ src, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&times;</button>
      <img src={src} alt="" onClick={e => e.stopPropagation()} />
    </div>
  )
}
