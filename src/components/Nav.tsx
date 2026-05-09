export default function Nav() {
  return (
    <nav>
      <a href="#top" className="nav-logo">Willow</a>
      <div className="nav-spacer" />
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#gallery">Gallery</a>
        <a href="#video">Video</a>
        <a href="#inquiry" className="nav-cta">Inquire</a>
      </div>
    </nav>
  )
}
