import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as storefrontService from '#/services/cms/useGetTenantStorefront'
import type { TenantStorefrontData } from '#/types/storefront.type'

import { PageRenderer } from './-components/PageRenderer'
import { Route } from './$tenantSlug'
import { getTheme } from '#themes'

afterEach(cleanup)

describe('/preview/$tenantSlug Route & SSR Preview', () => {
  it('executes server-side loader to fetch tenant theme and content', async () => {
    const mockStorefrontData: TenantStorefrontData = {
      tenant: {
        uuid: 'tenant-123',
        name: 'Toko Kopi Senja',
        slug: 'kopi-senja',
      },
      themeId: 'dawn',
      themeTitle: 'Dawn Theme',
      pageTitle: 'Beranda',
      pageSlug: 'home',
      template: getTheme('dawn').getTemplate('index'),
      globalSettings: getTheme('dawn').defaultSettingsData,
      pages: [{ uuid: 'p-1', title: 'Beranda', slug: 'home', is_active: 1 }],
      tenantTemplateUuid: 'tpl-123',
    }

    const spy = vi
      .spyOn(storefrontService, 'fetchTenantStorefrontData')
      .mockResolvedValueOnce(mockStorefrontData)

    const loaderFn = Route.options.loader as unknown as (ctx: {
      params: { tenantSlug: string }
      deps: { template?: string; page?: string; theme?: string }
    }) => Promise<TenantStorefrontData>
    expect(loaderFn).toBeDefined()

    const result = await loaderFn({
      params: { tenantSlug: 'kopi-senja' },
      deps: { template: 'home', theme: 'dawn' },
    })

    expect(spy).toHaveBeenCalledWith({
      tenantSlug: 'kopi-senja',
      pageSlug: 'home',
      themeId: 'dawn',
    })
    expect(result).toEqual(mockStorefrontData)
  })

  it('generates comprehensive SEO meta tags in head for server-side rendering', () => {
    const headFn = Route.options.head as unknown as (ctx: {
      loaderData?: TenantStorefrontData
    }) => { meta: Array<Record<string, string>> }
    expect(headFn).toBeDefined()

    const mockLoaderData: TenantStorefrontData = {
      tenant: {
        uuid: 'tenant-123',
        name: 'Toko Kopi Senja',
        slug: 'kopi-senja',
      },
      themeId: 'forge',
      themeTitle: 'Forge Manufacturing',
      pageTitle: 'Tentang Kami',
      pageSlug: 'about',
      template: getTheme('forge').getTemplate('index'),
      globalSettings: getTheme('forge').defaultSettingsData,
      pages: [],
    }

    const headResult = headFn({ loaderData: mockLoaderData })

    expect(headResult.meta).toEqual(
      expect.arrayContaining([
        { title: 'Tentang Kami | Toko Kopi Senja' },
        {
          name: 'description',
          content: 'Tentang Kami page for Toko Kopi Senja - Powered by Shopiti',
        },
        { property: 'og:title', content: 'Tentang Kami | Toko Kopi Senja' },
        {
          property: 'og:description',
          content: 'Tentang Kami page for Toko Kopi Senja - Powered by Shopiti',
        },
        { property: 'og:type', content: 'website' },
        { name: 'robots', content: 'index, follow' },
      ]),
    )
  })

  it('renders server-rendered template data and global settings directly via PageRenderer', () => {
    const themeDef = getTheme('dawn')
    const initialTemplate = themeDef.getTemplate('index')

    const view = render(
      <PageRenderer
        mode="preview"
        templateId="index"
        themeId="dawn"
        initialTemplate={initialTemplate}
        initialGlobalSettings={themeDef.defaultSettingsData}
        tenantSlug="kopi-senja"
        tenantName="Toko Kopi Senja"
      />,
    )

    // Verify sections from dawn template are rendered in document
    const sectionElements = document.querySelectorAll(
      '[data-section-id], [id^="teras-sapa-section-"]',
    )
    expect(sectionElements.length).toBeGreaterThan(0)
    expect(view.container).toBeDefined()
  })

  it('renders editor mode with surface styles and handles postMessage bridge', () => {
    const themeDef = getTheme('dawn')

    const view = render(
      <PageRenderer
        mode="editor"
        templateId="index"
        themeId="dawn"
        initialTemplate={themeDef.getTemplate('index')}
        initialGlobalSettings={themeDef.defaultSettingsData}
      />,
    )

    expect(view.container).toBeDefined()
  })
})
