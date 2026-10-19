import type { TemplateData } from '#themes/shared/types/theme'

export interface GlobalTemplateType {
  uuid: string
  title: string
  description?: string | null
  tier?: 'basic' | 'pro' | string
  brand_settings?: Record<string, unknown> | string | null
  is_active: number | boolean
  slug?: string | null
  tenant_category?: {
    uuid: string
    name: string
  } | null
}

export interface TenantTemplatePageType {
  uuid: string
  title: string
  slug: string
  template_data: TemplateData | Record<string, unknown> | null
  is_active: number | boolean
  version?: number
  tenant_template?: {
    uuid: string
  } | null
}

export interface TenantTemplateType {
  uuid: string
  active_template: boolean
  is_active: number | boolean
  template_settings: Record<string, unknown> | null
  version: number
  tenant?: {
    uuid: string
    name: string
    slug: string
  } | null
  global_template?: {
    uuid: string
    title: string
    tier?: string
  } | null
  pages?: TenantTemplatePageType[]
}
