import type { GlobalSettingsData, TemplateData } from '#themes'

export interface TenantStorefrontPageSummary {
  uuid: string
  title: string
  slug: string
  is_active: number | boolean
}

export interface TenantStorefrontData {
  tenant: {
    uuid: string
    name: string
    slug: string
  }
  themeId: string
  themeTitle: string
  pageTitle: string
  pageSlug: string
  template: TemplateData
  globalSettings: GlobalSettingsData
  pages: Array<TenantStorefrontPageSummary>
  tenantTemplateUuid?: string
}
