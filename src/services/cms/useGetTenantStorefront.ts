import { useQuery } from '@tanstack/react-query'

import type {
  TenantTemplatePageType,
  TenantTemplateType,
} from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import type { TenantStorefrontData } from '#/types/storefront.type'
import { fetchHelper } from '#/utils/fetchHelper'

import type { GlobalSettingsData, TemplateData } from '#themes'
import { DEFAULT_THEME_ID, getTheme } from '#themes'

export interface FetchTenantStorefrontParams {
  tenantSlug: string
  pageSlug?: string
  themeId?: string
}

export const fetchTenantStorefrontData = async ({
  tenantSlug,
  pageSlug = 'home',
  themeId: themeOverride,
}: FetchTenantStorefrontParams): Promise<TenantStorefrontData> => {
  const normalizedSlug = tenantSlug.trim().toLowerCase()
  const targetPageSlug =
    pageSlug === 'index' || !pageSlug ? 'home' : pageSlug.toLowerCase()

  try {
    const templatesRes = await fetchHelper<
      ApiResponse<Array<TenantTemplateType>>
    >('/api/v1/dashboard/cms/tenant-template')
    const allTemplates = templatesRes.data ?? []

    // Match templates belonging to this tenant by slug or uuid
    const tenantTemplates = allTemplates.filter(
      (t) =>
        t.tenant?.slug.toLowerCase() === normalizedSlug ||
        t.tenant?.uuid === tenantSlug,
    )

    // Find the active template, or fall back to the first one available
    const activeTemplate =
      tenantTemplates.find((t) => Boolean(t.active_template)) ??
      tenantTemplates.find((t) => Boolean(t.uuid))

    if (activeTemplate) {
      // Fetch instantiated pages for this template
      const pagesRes = await fetchHelper<
        ApiResponse<Array<TenantTemplatePageType>>
      >('/api/v1/dashboard/cms/tenant-template-page', {
        query: { tenant_template_uuid: activeTemplate.uuid },
      })
      const pages = pagesRes.data ?? []

      // Determine themeId
      const customSettings = activeTemplate.template_settings as
        Record<string, unknown> | undefined
      const customThemeId = customSettings?.theme_id as string | undefined
      const globalTitleTheme = activeTemplate.global_template?.title
        .toLowerCase()
        .includes('forge')
        ? 'forge'
        : activeTemplate.global_template?.title.toLowerCase().includes('dawn')
          ? 'dawn'
          : undefined
      const resolvedThemeId =
        themeOverride || customThemeId || globalTitleTheme || DEFAULT_THEME_ID
      const themeDef = getTheme(resolvedThemeId)

      // Find matched page
      const matchedPage =
        pages.find(
          (p) =>
            p.slug.toLowerCase() === targetPageSlug ||
            (targetPageSlug === 'home' && p.slug.toLowerCase() === 'index') ||
            (targetPageSlug === 'index' && p.slug.toLowerCase() === 'home'),
        ) ?? pages.find((p) => Boolean(p.uuid))

      // Determine template layout and sections
      let template: TemplateData
      if (
        matchedPage?.template_data &&
        typeof matchedPage.template_data === 'object' &&
        'sections' in matchedPage.template_data
      ) {
        template = themeDef.normalizeTemplate(
          matchedPage.template_data as TemplateData,
        )
      } else {
        template = themeDef.normalizeTemplate(
          themeDef.getTemplate(targetPageSlug),
        )
      }

      // Determine global settings (tokens, typography, color scheme)
      let globalSettings: GlobalSettingsData = themeDef.defaultSettingsData
      if (
        customSettings &&
        'current' in customSettings &&
        typeof customSettings.current === 'object'
      ) {
        globalSettings = customSettings as unknown as GlobalSettingsData
      }

      const displayThemeTitle =
        (customSettings?.theme_title as string) ||
        activeTemplate.global_template?.title ||
        themeDef.name

      const resolvedPageTitle = matchedPage
        ? matchedPage.title
        : targetPageSlug === 'home'
          ? 'Home'
          : targetPageSlug
      const resolvedPageSlug = matchedPage ? matchedPage.slug : targetPageSlug

      return {
        tenant: {
          uuid: activeTemplate.tenant?.uuid ?? '',
          name: activeTemplate.tenant?.name ?? tenantSlug,
          slug: activeTemplate.tenant?.slug ?? tenantSlug,
        },
        themeId: themeDef.id,
        themeTitle: displayThemeTitle,
        pageTitle: resolvedPageTitle,
        pageSlug: resolvedPageSlug,
        template,
        globalSettings,
        pages: pages.map((p) => ({
          uuid: p.uuid,
          title: p.title,
          slug: p.slug,
          is_active: p.is_active,
        })),
        tenantTemplateUuid: activeTemplate.uuid,
      }
    }
  } catch (error) {
    console.error(
      `Failed to fetch storefront data for tenant "${tenantSlug}":`,
      error,
    )
  }

  // Fallback when no template is installed or backend is unreachable
  const fallbackTheme = getTheme(themeOverride || DEFAULT_THEME_ID)
  return {
    tenant: {
      uuid: '',
      name: normalizedSlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: normalizedSlug,
    },
    themeId: fallbackTheme.id,
    themeTitle: fallbackTheme.name,
    pageTitle: targetPageSlug === 'home' ? 'Home' : targetPageSlug,
    pageSlug: targetPageSlug,
    template: fallbackTheme.normalizeTemplate(
      fallbackTheme.getTemplate(targetPageSlug),
    ),
    globalSettings: fallbackTheme.defaultSettingsData,
    pages: [],
  }
}

export const useGetTenantStorefront = ({
  tenantSlug,
  pageSlug,
  themeId,
  enabled = true,
}: FetchTenantStorefrontParams & { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['cms', 'tenant-storefront', tenantSlug, pageSlug, themeId],
    enabled: Boolean(tenantSlug) && enabled,
    queryFn: () => fetchTenantStorefrontData({ tenantSlug, pageSlug, themeId }),
  })
}
