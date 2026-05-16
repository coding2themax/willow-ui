import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBanner from '../ErrorBanner'

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Something went wrong" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows no dismiss button when onDismiss is omitted', () => {
    render(<ErrorBanner message="Oops" />)
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument()
  })

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<ErrorBanner message="Oops" onDismiss={() => {}} />)
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
  })

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn()
    render(<ErrorBanner message="Oops" onDismiss={onDismiss} />)
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
