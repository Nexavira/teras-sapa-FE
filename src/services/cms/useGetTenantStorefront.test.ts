import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchHelper } from '#/utils/fetchHelper'

import { fetchTenantStorefrontData } from './useGetTenantStorefront'

vi.mock('#/utils/fetchHelper', () => ({
  fetchHelper: vi.fn(),
}))

const mockFetchHelper = vi.mocked(fetchHelper)

describe('fetchTenantStorefrontData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches tenant template, pages, and theme settings for an existing tenant', async () => {
    mockFetchHelper.mockImplementation((endpoint: string) => {
      if (endpoint === '/api/v1/dashboard/cms/tenant-template') {
        return {
          success: true,
          data: [
            {
              uuid: 'template-uuid-1',
              active_template: true,
              is_active: 1,
              version: 1,
              tenant: {
                uuid: 'tenant-uuid-1',
                name: 'Ruang Cerita',
                slug: 'ruang-cerita',
              },
              template_settings: {
                theme_id: 'forge',
                theme_title: 'Custom Forge',
                current: {
                  shop_name: 'Ruang Cerita Store',
                },
              },
              global_template: {
                uuid: 'gt-1',
                title: 'Forge Manufacturing',
              },
            },
          ],
        }
      }

      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page') {
        return {
          success: true,
          data: [
            {
              uuid: 'page-uuid-1',
              title: 'Home',
              slug: 'home',
              is_active: 1,
              template_data: {
                name: 'Home page',
                order: ['hero'],
                sections: {
                  hero: {
                    type: 'hero',
                    settings: { title: 'Welcome to Ruang Cerita' },
                    block_order: [],
                    blocks: {},
                  },
                },
              },
            },
            {
              uuid: 'page-uuid-2',
              title: 'About us',
              slug: 'about',
              is_active: 1,
              template_data: {
                name: 'About page',
                order: ['story'],
                sections: {
                  story: {
                    type: 'story',
                    settings: { title: 'Our Story' },
                    block_order: [],
                    blocks: {},
                  },
                },
              },
            },
          ],
        }
      }

      throw new Error(`Unexpected endpoint: ${endpoint}`)
    })

    const result = await fetchTenantStorefrontData({
      tenantSlug: 'ruang-cerita',
      pageSlug: 'home',
    })

    expect(result.tenant.name).toBe('Ruang Cerita')
    expect(result.tenant.slug).toBe('ruang-cerita')
    expect(result.themeId).toBe('forge')
    expect(result.themeTitle).toBe('Custom Forge')
    expect(result.pageTitle).toBe('Home')
    expect(result.pageSlug).toBe('home')
    expect(result.template.order).toEqual(['hero'])
    expect(result.globalSettings).toEqual({
      theme_id: 'forge',
      theme_title: 'Custom Forge',
      current: {
        shop_name: 'Ruang Cerita Store',
      },
    })
    expect(result.pages).toHaveLength(2)
  })

  it('fetches a specific subpage when pageSlug is provided', async () => {
    mockFetchHelper.mockImplementation((endpoint: string) => {
      if (endpoint === '/api/v1/dashboard/cms/tenant-template') {
        return {
          success: true,
          data: [
            {
              uuid: 'template-uuid-1',
              active_template: true,
              is_active: 1,
              version: 1,
              tenant: {
                uuid: 'tenant-uuid-1',
                name: 'Ruang Cerita',
                slug: 'ruang-cerita',
              },
              template_settings: {
                theme_id: 'forge',
              },
            },
          ],
        }
      }

      if (endpoint === '/api/v1/dashboard/cms/tenant-template-page') {
        return {
          success: true,
          data: [
            {
              uuid: 'page-uuid-1',
              title: 'Home',
              slug: 'home',
              is_active: 1,
              template_data: {
                order: ['hero'],
                sections: {},
              },
            },
            {
              uuid: 'page-uuid-2',
              title: 'About us',
              slug: 'about',
              is_active: 1,
              template_data: {
                order: ['about_section'],
                sections: {
                  about_section: {
                    type: 'company-bento',
                    settings: {},
                    block_order: [],
                    blocks: {},
                  },
                },
              },
            },
          ],
        }
      }

      throw new Error(`Unexpected endpoint: ${endpoint}`)
    })

    const result = await fetchTenantStorefrontData({
      tenantSlug: 'ruang-cerita',
      pageSlug: 'about',
    })

    expect(result.pageTitle).toBe('About us')
    expect(result.pageSlug).toBe('about')
    expect(result.template.order).toEqual(['about_section'])
  })

  it('falls back safely when tenant is not found in database', async () => {
    mockFetchHelper.mockResolvedValueOnce({
      success: true,
      data: [],
    })

    const result = await fetchTenantStorefrontData({
      tenantSlug: 'unknown-store',
      pageSlug: 'home',
    })

    expect(result.tenant.name).toBe('Unknown Store')
    expect(result.tenant.slug).toBe('unknown-store')
    expect(result.themeId).toBe('dawn')
    expect(result.template).toBeDefined()
    expect(result.template.order).toBeDefined()
    expect(result.globalSettings).toBeDefined()
    expect(result.pages).toEqual([])
  })

  it('handles backend error gracefully without throwing', async () => {
    mockFetchHelper.mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchTenantStorefrontData({
      tenantSlug: 'network-failed',
      pageSlug: 'home',
    })

    expect(result.tenant.slug).toBe('network-failed')
    expect(result.themeId).toBe('dawn')
    expect(result.template).toBeDefined()
  })
})
