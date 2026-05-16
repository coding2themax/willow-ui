import { render, screen } from '@testing-library/react'
import StatsBar from '../StatsBar'

describe('StatsBar', () => {
  it('renders all stat labels and values', () => {
    render(<StatsBar />)

    const stats = [
      ['Age', '3 Years'],
      ['Breed', 'Draft Cross'],
      ['Color', 'Bay'],
      ['Sex', 'Mare'],
      ['Location', 'Chandler, AZ'],
      ['Price', '$3,500 OBO'],
    ]

    for (const [label, value] of stats) {
      expect(screen.getByText(label)).toBeInTheDocument()
      expect(screen.getByText(value)).toBeInTheDocument()
    }
  })

  it('renders six stat items', () => {
    const { container } = render(<StatsBar />)
    expect(container.querySelectorAll('.stat')).toHaveLength(6)
  })
})
