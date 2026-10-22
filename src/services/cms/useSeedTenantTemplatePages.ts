import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CreateTenantTemplatePageBody } from '#/routes/_authenticated/admin/themes/-utils/-create-page-schema'
import type { TenantTemplatePageType } from '#/types/cms.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import type { ThemeDefinition } from '#themes'

export interface SeedTenantTemplatePagesParams {
  tenantTemplateUuid: string
  themeDefinition: ThemeDefinition
}

export const seedTenantTemplatePages = async ({
  tenantTemplateUuid,
  themeDefinition,
}: SeedTenantTemplatePagesParams): Promise<Array<TenantTemplatePageType>> => {
  // Check existing pages first to avoid duplicate seeds
  let existingSlugs = new Set<string>()
  try {
    const existingRes = await fetchHelper<
      ApiResponse<Array<TenantTemplatePageType>>
    >('/api/v1/dashboard/cms/tenant-template-page', {
      query: { tenant_template_uuid: tenantTemplateUuid },
    })
    existingSlugs = new Set(
      (existingRes.data || []).map((p) => p.slug.toLowerCase()),
    )
  } catch (err) {
    console.warn('Could not fetch existing pages for seed check:', err)
  }

  const catalogEntries = Object.entries(themeDefinition.templateCatalog)
  const createdPages: Array<TenantTemplatePageType> = []

  for (const [key, entry] of catalogEntries) {
    const slug = key === 'index' ? 'home' : key.toLowerCase()
    // Skip if page with this slug already exists (or home/index equivalence)
    if (
      existingSlugs.has(slug) ||
      (slug === 'home' && existingSlugs.has('index')) ||
      (slug === 'index' && existingSlugs.has('home'))
    ) {
      continue
    }

    try {
      const res = await fetchHelper<
        ApiResponse<TenantTemplatePageType>,
        CreateTenantTemplatePageBody
      >('/api/v1/dashboard/cms/tenant-template-page/create', {
        method: 'POST',
        body: {
          tenant_template_uuid: tenantTemplateUuid,
          title: entry.label,
          slug,
          template_data: entry.data,
          is_active: 1,
        },
      })
      if (res.data) {
        createdPages.push(res.data)
      }
    } catch (err) {
      console.warn(`Failed to seed default page ${key}:`, err)
    }
  }

  return createdPages
}

export const useSeedTenantTemplatePages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: seedTenantTemplatePages,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          'cms',
          'tenant-template-pages',
          variables.tenantTemplateUuid,
        ],
      })
      void queryClient.invalidateQueries({
        queryKey: ['cms', 'tenant-templates'],
      })
    },
  })
}
