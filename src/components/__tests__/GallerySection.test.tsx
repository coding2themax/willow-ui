import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GallerySection from '../GallerySection'

vi.mock('../../api/gallery', () => ({
  getPhotos: vi.fn(),
}))

import { getPhotos } from '../../api/gallery'

const mockGetPhotos = vi.mocked(getPhotos)

const apiPhotos = [
  { id: 'a1', src: '/api/photo1.jpg', alt: 'Photo 1', featured: true },
  { id: 'a2', src: '/api/photo2.jpg', alt: 'Photo 2' },
  { id: 'a3', src: '/api/photo3.jpg', alt: 'Photo 3' },
]

describe('GallerySection', () => {
  afterEach(() => vi.clearAllMocks())

  it('renders section headings', async () => {
    mockGetPhotos.mockResolvedValue([])
    render(<GallerySection onOpen={() => {}} />)
    expect(screen.getByText('Gallery')).toBeInTheDocument()
    expect(screen.getByText('Photos of Willow')).toBeInTheDocument()
  })

  it('renders fallback photos before API resolves', () => {
    // Never resolves during this test
    mockGetPhotos.mockReturnValue(new Promise(() => {}))
    const { container } = render(<GallerySection onOpen={() => {}} />)
    expect(container.querySelectorAll('.gallery-item').length).toBeGreaterThan(0)
  })

  it('updates photos when the API returns results', async () => {
    mockGetPhotos.mockResolvedValue(apiPhotos)
    render(<GallerySection onOpen={() => {}} />)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Photo 1' })).toBeInTheDocument()
    })
  })

  it('keeps fallback photos when the API call fails', async () => {
    mockGetPhotos.mockRejectedValue(new Error('network'))
    render(<GallerySection onOpen={() => {}} />)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Willow full body' })).toBeInTheDocument()
    })
  })

  it('calls onOpen with the photo src when a gallery item is clicked', async () => {
    mockGetPhotos.mockResolvedValue(apiPhotos)
    const onOpen = vi.fn()
    render(<GallerySection onOpen={onOpen} />)

    await waitFor(() => screen.getByRole('img', { name: 'Photo 1' }))
    await userEvent.click(screen.getByRole('img', { name: 'Photo 1' }).closest('.gallery-item')!)
    expect(onOpen).toHaveBeenCalledWith('/api/photo1.jpg')
  })

  it('places the featured photo first in the grid', async () => {
    mockGetPhotos.mockResolvedValue(apiPhotos)
    const { container } = render(<GallerySection onOpen={() => {}} />)

    await waitFor(() => screen.getByRole('img', { name: 'Photo 1' }))
    const items = container.querySelectorAll('.gallery-item')
    expect(items[0]).toHaveClass('featured')
    expect(items[0].querySelector('img')).toHaveAttribute('alt', 'Photo 1')
  })
})
