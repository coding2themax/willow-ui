import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../Footer'

const renderFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>)

describe('Footer', () => {
  it('renders horse details', () => {
    renderFooter()
    expect(screen.getByText('Willow')).toBeInTheDocument()
    expect(screen.getByText(/Bay Draft Cross Mare/)).toBeInTheDocument()
    expect(screen.getByText(/\$3,500 OBO/)).toBeInTheDocument()
  })

  it('renders the Admin and Progress links', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /progress/i })).toBeInTheDocument()
  })

  it('renders Share Link button initially', () => {
    renderFooter()
    expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
  })

  it('shows "Copied!" after clicking the share button', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
    renderFooter()
    await userEvent.click(screen.getByRole('button', { name: /share link/i }))
    expect(await screen.findByRole('button', { name: /copied!/i })).toBeInTheDocument()
  })

  it('resets "Copied!" back to "Share Link" after 2 seconds', async () => {
    vi.useFakeTimers()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })
    renderFooter()
    // Use act to flush the clipboard promise and resulting React state update
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /share link/i }))
      await Promise.resolve()
    })
    expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
