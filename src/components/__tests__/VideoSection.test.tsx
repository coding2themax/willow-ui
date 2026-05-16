import { render, screen } from '@testing-library/react'
import VideoSection from '../VideoSection'

describe('VideoSection', () => {
  it('renders section headings', () => {
    render(<VideoSection />)
    expect(screen.getByText('See Her Move')).toBeInTheDocument()
    expect(screen.getByText('Willow in Motion')).toBeInTheDocument()
  })

  it('renders the placeholder text', () => {
    render(<VideoSection />)
    expect(screen.getByText('Video coming soon')).toBeInTheDocument()
  })

  it('has the correct section id', () => {
    const { container } = render(<VideoSection />)
    expect(container.querySelector('#video')).toBeInTheDocument()
  })
})
