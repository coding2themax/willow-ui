import { render, screen } from '@testing-library/react'
import AboutSection from '../AboutSection'

describe('AboutSection', () => {
  it('renders section headings', () => {
    render(<AboutSection />)
    expect(screen.getByText('About Her')).toBeInTheDocument()
    expect(screen.getByText('Meet Willow')).toBeInTheDocument()
  })

  it('renders all trait labels and values', () => {
    render(<AboutSection />)

    const labels = ['Temperament', 'Training', 'Ideal For', 'Pre-Purchase Exam', 'Loads & Ties', 'Current on Care']
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    expect(screen.getByText('Curious & Smart')).toBeInTheDocument()
    expect(screen.getByText('Partially Started')).toBeInTheDocument()
    expect(screen.getByText('Trainer / Project')).toBeInTheDocument()
    // "Yes" appears twice (Loads & Ties + Current on Care)
    expect(screen.getAllByText('Yes')).toHaveLength(2)
  })

  it('renders the about photo', () => {
    render(<AboutSection />)
    const img = screen.getByRole('img', { name: 'Willow grazing' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/uploads/IMG_5992.jpeg')
  })

  it('has the correct section id', () => {
    const { container } = render(<AboutSection />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })
})
