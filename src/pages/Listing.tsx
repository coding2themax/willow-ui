import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import AboutSection from '../components/AboutSection'
import GallerySection from '../components/GallerySection'
import Lightbox from '../components/Lightbox'
import VideoSection from '../components/VideoSection'
import InquirySection from '../components/InquirySection'
import Footer from '../components/Footer'
import './Listing.css'

export default function Listing() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const openLightbox  = (src: string) => { setLightboxSrc(src); document.body.style.overflow = 'hidden' }
  const closeLightbox = ()            => { setLightboxSrc(null); document.body.style.overflow = '' }

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

  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <AboutSection />
      <GallerySection onOpen={openLightbox} />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={closeLightbox} />}
      <VideoSection />
      <InquirySection />
      <Footer />
    </>
  )
}
