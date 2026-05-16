import { render, screen } from '@testing-library/react'
import Spinner from '../Spinner'

describe('Spinner', () => {
  it('renders with default size', () => {
    render(<Spinner />)
    const svg = screen.getByLabelText('Loading')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('width', '18')
    expect(svg).toHaveAttribute('height', '18')
  })

  it('renders with a custom size', () => {
    render(<Spinner size={14} />)
    const svg = screen.getByLabelText('Loading')
    expect(svg).toHaveAttribute('width', '14')
    expect(svg).toHaveAttribute('height', '14')
  })
})
