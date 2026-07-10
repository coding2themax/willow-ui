import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BookViewingSection from '../BookViewingSection'

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
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}))

import { createInquiry } from '../../api/inquiries'
import type { Inquiry } from '../admin/types'

const stubInquiry: Inquiry = { id: 1, name: '', email: '', date: '', status: 'New' }
const mockCreateInquiry = vi.mocked(createInquiry)

const pickFirstAvailableDayAndTime = async () => {
  const days = screen.getAllByRole('button').filter(b => b.className.includes('booking-day') && !b.hasAttribute('disabled'))
  await userEvent.click(days[0])
  await userEvent.click(screen.getByRole('button', { name: '11:00 AM' }))
}

const fillRequiredFields = async () => {
  await pickFirstAvailableDayAndTime()
  await userEvent.type(screen.getByLabelText(/name \*/i), 'Jane Doe')
  await userEvent.type(screen.getByLabelText(/email \*/i), 'jane@example.com')
}

describe('BookViewingSection', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders the calendar, time slots and contact fields', () => {
    render(<BookViewingSection />)
    expect(screen.getByText(/come meet willow/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '11:00 AM' })).toBeInTheDocument()
  })

  it('disables submit until a day and time are selected', async () => {
    render(<BookViewingSection />)
    expect(screen.getByRole('button', { name: /select a day & time/i })).toBeDisabled()

    await pickFirstAvailableDayAndTime()
    expect(screen.getByRole('button', { name: /confirm ·/i })).not.toBeDisabled()
  })

  it('shows a success state referencing the chosen slot after submission', async () => {
    mockCreateInquiry.mockResolvedValue(stubInquiry)
    render(<BookViewingSection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /confirm ·/i }))

    await waitFor(() => {
      expect(screen.getByText(/request sent!/i)).toBeInTheDocument()
    })
    expect(mockCreateInquiry).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: expect.stringContaining('11:00 AM'),
      })
    )
  })

  it('shows an error banner when the API call fails', async () => {
    mockCreateInquiry.mockRejectedValue(new Error('Server error'))
    render(<BookViewingSection />)
    await fillRequiredFields()
    await userEvent.click(screen.getByRole('button', { name: /confirm ·/i }))

    await waitFor(() => {
      expect(screen.getByTestId('error-banner')).toBeInTheDocument()
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })

  it('resets the selected time when a new day is picked', async () => {
    render(<BookViewingSection />)
    await pickFirstAvailableDayAndTime()
    expect(screen.getByRole('button', { name: '11:00 AM' })).toHaveClass('on')

    const days = screen.getAllByRole('button').filter(b => b.className.includes('booking-day') && !b.hasAttribute('disabled') && !b.className.includes('sel'))
    await userEvent.click(days[0])

    expect(screen.getByRole('button', { name: '11:00 AM' })).not.toHaveClass('on')
    expect(screen.getByRole('button', { name: /select a day & time/i })).toBeDisabled()
  })
})
