import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import InquirySection from '../InquirySection'

vi.mock('../../api/inquiries', () => ({
  createInquiry: vi.fn(),
}))

vi.mock('../ui/Spinner', () => ({
  default: () => <span data-testid="spinner" />,
}))

vi.mock('../ui/ErrorBanner', () => ({
  default: ({ message, onDismiss }: { message: string; onDismiss: () => void }) => (
    <div role="alert" data-testid="error-banner">
      {message}
      {/* type="button" prevents the button from submitting the parent form */}
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}))

import { createInquiry } from '../../api/inquiries'
import type { Inquiry } from '../admin/types'

const stubInquiry: Inquiry = { id: 1, name: '', email: '', date: '', status: 'New' }

const mockCreateInquiry = vi.mocked(createInquiry)

const fillRequiredFields = async () => {
  await userEvent.type(screen.getByLabelText(/name \*/i), 'Jane Doe')
  await userEvent.type(screen.getByLabelText(/email \*/i), 'jane@example.com')
  await userEvent.selectOptions(screen.getByLabelText(/experience level \*/i), 'Intermediate')
  await userEvent.type(screen.getByLabelText(/message \*/i), 'Very interested!')
}

describe('InquirySection', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the inquiry form', () => {
    render(<InquirySection />)
    expect(screen.getByRole('button', { name: /send inquiry/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
  })

  it('shows success state after a successful submission', async () => {
    mockCreateInquiry.mockResolvedValue(stubInquiry)
    render(<InquirySection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /send inquiry/i }))

    await waitFor(() => {
      expect(screen.getByText(/thank you!/i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /send inquiry/i })).not.toBeInTheDocument()
  })

  it('shows a spinner and disables button while submitting', async () => {
    let resolve: () => void
    mockCreateInquiry.mockReturnValue(new Promise(r => { resolve = () => r(stubInquiry) }))

    render(<InquirySection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /send inquiry/i }))

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sending…/i })).toBeDisabled()

    resolve!()
  })

  it('shows an error banner when the API call fails', async () => {
    mockCreateInquiry.mockRejectedValue(new Error('Server error'))
    render(<InquirySection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /send inquiry/i }))

    await waitFor(() => {
      expect(screen.getByTestId('error-banner')).toBeInTheDocument()
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('clears the error banner when dismissed', async () => {
    mockCreateInquiry.mockRejectedValue(new Error('Bad request'))
    render(<InquirySection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /send inquiry/i }))

    await waitFor(() => screen.getByTestId('error-banner'))
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    await waitFor(() => expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument())
  })
})
