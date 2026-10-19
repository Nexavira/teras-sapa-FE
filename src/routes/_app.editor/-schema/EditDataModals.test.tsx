import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '#/-components/ui/ThemeProvider'
import { editorStore } from '#/store/editorStore'

import { EditPageDataModal } from './EditPageDataModal'
import { EditThemeDataModal } from './EditThemeDataModal'

const mockUpdateTemplate = vi.fn()
const mockUpdatePage = vi.fn()

vi.mock('#/services/cms/useUpdateTenantTemplate', () => ({
  useUpdateTenantTemplate: () => ({
    mutateAsync: mockUpdateTemplate,
    isPending: false,
  }),
}))

vi.mock('#/services/cms/useUpdateTenantTemplatePage', () => ({
  useUpdateTenantTemplatePage: () => ({
    mutateAsync: mockUpdatePage,
    isPending: false,
  }),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}

describe('EditThemeDataModal and EditPageDataModal', () => {
  it('renders EditThemeDataModal and submits updated theme data', async () => {
    mockUpdateTemplate.mockResolvedValueOnce({
      uuid: 'tpl-123',
      template_settings: { theme_title: 'Updated Theme Name' },
    })

    const handleSuccess = vi.fn()
    const handleClose = vi.fn()
    const Wrapper = createTestWrapper()

    render(
      <Wrapper>
        <EditThemeDataModal
          isOpen={true}
          tenantTemplateUuid="tpl-123"
          currentTitle="Original Theme Title"
          isPublished={false}
          isActive={true}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      </Wrapper>,
    )

    expect(screen.getByText('Edit Data Tema')).toBeDefined()
    const titleInput = screen.getByLabelText('Nama Tema')
    expect(titleInput).toBeDefined()
    expect((titleInput as HTMLInputElement).value).toBe('Original Theme Title')

    fireEvent.change(titleInput, { target: { value: 'My Summer Shop 2026' } })
    const submitBtn = screen.getByRole('button', { name: /simpan perubahan/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockUpdateTemplate).toHaveBeenCalledTimes(1)
      expect(mockUpdateTemplate).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_template_uuid: 'tpl-123',
          template_settings: expect.objectContaining({
            theme_title: 'My Summer Shop 2026',
          }),
        }),
      )
      expect(editorStore.state.themeData?.title).toBe('My Summer Shop 2026')
      expect(handleClose).toHaveBeenCalled()
    })
  })

  it('renders EditPageDataModal and submits updated page data', async () => {
    mockUpdatePage.mockResolvedValueOnce({
      uuid: 'page-456',
      title: 'About Our Brand',
      slug: 'about-us',
      is_active: 1,
    })

    const handleSuccess = vi.fn()
    const handleClose = vi.fn()
    const Wrapper = createTestWrapper()

    render(
      <Wrapper>
        <EditPageDataModal
          isOpen={true}
          pageUuid="page-456"
          tenantTemplateUuid="tpl-123"
          currentTitle="Tentang Kami"
          currentSlug="tentang-kami"
          isActive={1}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      </Wrapper>,
    )

    expect(screen.getByText('Edit Data Halaman')).toBeDefined()
    const titleInput = screen.getByLabelText('Judul Halaman')
    const slugInput = screen.getByLabelText('Slug URL Halaman')

    expect((titleInput as HTMLInputElement).value).toBe('Tentang Kami')
    expect((slugInput as HTMLInputElement).value).toBe('tentang-kami')

    fireEvent.change(titleInput, { target: { value: 'About Our Brand' } })
    fireEvent.change(slugInput, { target: { value: 'about-us' } })

    const submitBtn = screen.getByRole('button', {
      name: /simpan data halaman/i,
    })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockUpdatePage).toHaveBeenCalledTimes(1)
      expect(mockUpdatePage).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_template_page_uuid: 'page-456',
          title: 'About Our Brand',
          slug: 'about-us',
        }),
      )
      expect(editorStore.state.activePageData?.title).toBe('About Our Brand')
      expect(editorStore.state.activePageData?.slug).toBe('about-us')
      expect(handleClose).toHaveBeenCalled()
    })
  })
})
