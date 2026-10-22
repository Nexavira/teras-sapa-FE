import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useForm } from 'react-hook-form'

import { ThemeProvider } from '../ThemeProvider'
import { ImagePickerInput } from './image-picker-input'

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithProviders = (ui: ReactNode) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
  )
}

describe('ImagePickerInput', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders label and empty state prompt when no image is selected', () => {
    renderWithProviders(
      <ImagePickerInput
        label="Gambar Banner"
        placeholder="Pilih gambar banner promo..."
      />,
    )

    expect(screen.getByText('Gambar Banner')).toBeDefined()
    expect(screen.getByText('Pilih gambar banner promo...')).toBeDefined()
    expect(screen.getByText(/Pustaka Media/i)).toBeDefined()
  })

  it('renders preview card and actions when value is provided', () => {
    const onClear = vi.fn()
    renderWithProviders(
      <ImagePickerInput
        label="Gambar Banner"
        value="https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
        onChange={onClear}
      />,
    )

    expect(screen.getByText('Gambar Banner')).toBeDefined()
    expect(screen.getByAltText('Pratinjau terpilih')).toBeDefined()
    expect(screen.getByRole('button', { name: /Ganti/i })).toBeDefined()
    expect(
      screen.getByRole('button', { name: /Hapus gambar ini/i }),
    ).toBeDefined()
  })

  it('calls onChange with empty string when delete button is clicked', () => {
    const handleChange = vi.fn()
    renderWithProviders(
      <ImagePickerInput
        label="Gambar Banner"
        value="https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
        onChange={handleChange}
      />,
    )

    const deleteBtn = screen.getByRole('button', { name: /Hapus gambar ini/i })
    fireEvent.click(deleteBtn)

    expect(handleChange).toHaveBeenCalledWith('')
  })

  it('integrates seamlessly with react-hook-form control', () => {
    const TestFormComponent = () => {
      const { control } = useForm<{ bannerImage: string }>({
        defaultValues: {
          bannerImage: 'https://images.unsplash.com/photo-test-url.jpg',
        },
      })

      return (
        <form>
          <ImagePickerInput
            control={control}
            name="bannerImage"
            label="Banner Toko"
          />
        </form>
      )
    }

    renderWithProviders(<TestFormComponent />)

    expect(screen.getByText('Banner Toko')).toBeDefined()
    expect(screen.getByAltText('Pratinjau terpilih')).toBeDefined()
  })
})
