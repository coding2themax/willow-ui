import { useRef, useEffect } from 'react'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const skyRef  = useRef<HTMLDivElement>(null)
  const bgRef   = useRef<HTMLDivElement>(null)
  const midRef  = useRef<HTMLDivElement>(null)
  const fgRef   = useRef<HTMLDivElement>(null)

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

  return (
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
  )
}
