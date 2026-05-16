import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Lightbox from '../Lightbox'

describe('Lightbox', () => {
  const src = '/uploads/IMG_5992.jpeg'

  it('renders the image with the given src', () => {
    const { container } = render(<Lightbox src={src} onClose={() => {}} />)
    expect(container.querySelector('img')).toHaveAttribute('src', src)
  })

  it('calls onClose when the overlay backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(<Lightbox src={src} onClose={onClose} />)
    await userEvent.click(container.querySelector('.lightbox')!)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Lightbox src={src} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the Escape key is pressed', async () => {
    const onClose = vi.fn()
    render(<Lightbox src={src} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('does NOT call onClose when clicking directly on the image', async () => {
    const onClose = vi.fn()
    const { container } = render(<Lightbox src={src} onClose={onClose} />)
    await userEvent.click(container.querySelector('img')!)
    expect(onClose).not.toHaveBeenCalled()
  })
})
