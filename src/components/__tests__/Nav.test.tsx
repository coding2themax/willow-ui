import { render, screen } from '@testing-library/react'
import Nav from '../Nav'

describe('Nav', () => {
  it('renders the site logo link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Willow' })).toHaveAttribute('href', '#top')
  })

  it('renders all navigation links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('href', '#gallery')
    expect(screen.getByRole('link', { name: 'Video' })).toHaveAttribute('href', '#video')
  })

  it('renders the Inquire CTA link', () => {
    render(<Nav />)
    const cta = screen.getByRole('link', { name: 'Inquire' })
    expect(cta).toHaveAttribute('href', '#inquiry')
    expect(cta).toHaveClass('nav-cta')
  })
})
