import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchHelper } from '#/utils/fetchHelper'

import { seedTenantTemplatePages } from './useSeedTenantTemplatePages'
import type { ThemeDefinition } from '#themes'

vi.mock('#/utils/fetchHelper', () => ({
  fetchHelper: vi.fn(),
}))

const mockFetchHelper = vi.mocked(fetchHelper)

const mockTheme: ThemeDefinition = {
  id: 'forge',
  name: 'Forge',
  category: 'Industrial',
  description: 'Industrial Theme',
  defaultSettingsData: {
    current: {},
  },
  templateCatalog: {
    index: {
      label: 'Home',
      data: { name: 'Home', order: ['hero'], sections: {} },
    },
    about: {
      label: 'About us',
      data: { name: 'About', order: ['story'], sections: {} },
    },
    contact: {
      label: 'Contact',
      data: { name: 'Contact', order: ['form'], sections: {} },
    },
  },
  normalizeTemplate: vi.fn((t) => t),
  getTemplate: vi.fn(),
}

describe('seedTenantTemplatePages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('seeds all catalog pages when no pages exist in database', async () => {
    mockFetchHelper.mockImplementation((endpoint: string, options?: any) => {
      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page') {
        return Promise.resolve({
          success: true,
          data: [],
        })
      }
      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page/create') {
        return Promise.resolve({
          success: true,
          data: {
            uuid: `created-${options?.body?.slug}`,
            title: options?.body?.title,
            slug: options?.body?.slug,
            template_data: options?.body?.template_data,
            is_active: 1,
          },
        })
      }
      return Promise.reject(new Error(`Unhandled endpoint: ${endpoint}`))
    })

    const result = await seedTenantTemplatePages({
      tenantTemplateUuid: 'tpl-123',
      themeDefinition: mockTheme,
    })

    expect(result).toHaveLength(3)
    expect(result.map((r) => r.slug)).toEqual(['home', 'about', 'contact'])
    expect(mockFetchHelper).toHaveBeenCalledTimes(4) // 1 check + 3 creates
  })

  it('skips existing pages and only seeds missing ones', async () => {
    mockFetchHelper.mockImplementation((endpoint: string, options?: any) => {
      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page') {
        return Promise.resolve({
          success: true,
          data: [
            {
              uuid: 'existing-home',
              title: 'Home',
              slug: 'home',
              template_data: null,
              is_active: 1,
            },
          ],
        })
      }
      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page/create') {
        return Promise.resolve({
          success: true,
          data: {
            uuid: `created-${options?.body?.slug}`,
            title: options?.body?.title,
            slug: options?.body?.slug,
            template_data: options?.body?.template_data,
            is_active: 1,
          },
        })
      }
      return Promise.reject(new Error(`Unhandled endpoint: ${endpoint}`))
    })

    const result = await seedTenantTemplatePages({
      tenantTemplateUuid: 'tpl-123',
      themeDefinition: mockTheme,
    })

    // Should only seed 'about' and 'contact', because 'home' already exists
    expect(result).toHaveLength(2)
    expect(result.map((r) => r.slug)).toEqual(['about', 'contact'])
  })
})
