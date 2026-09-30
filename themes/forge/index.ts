import defaultSettingsData from './config/settings_data.json'
import settingsSchemaData from './config/settings_schema.json'
import { ThemeLayout } from './layout/ThemeLayout'
import { BlockRegistry, SectionRegistry } from './registry'
import { getTemplate, templateCatalog } from './templates/catalog'
import type {
  GlobalSettingsSchema,
  TemplateData,
  ThemeDefinition,
} from '#themes/shared/types/theme'

export * from './blocks/article-paragraph'
export * from './blocks/article-quote'
export * from './blocks/article-subheading'
export * from './blocks/bento-card'
export * from './blocks/BlockRenderer'
export * from './blocks/button'
export * from './blocks/contact-form'
export * from './blocks/contact-info'
export * from './blocks/flex'
export * from './blocks/grid'
export * from './blocks/heading'
export * from './blocks/hero-meta'
export * from './blocks/image'
export * from './blocks/list-item'
export * from './blocks/metric-item'
export * from './blocks/text'
export * from './layout/ThemeLayout'
export * from './registry'
export * from './sections/company-article'
export * from './sections/company-bento'
export * from './sections/company-footer'
export * from './sections/company-header'
export * from './sections/company-hero'
export * from './sections/company-metrics'
export * from './sections/company-page'
export * from './sections/company-quote'
export * from './sections/company-split'
export * from './snippets'

export const forgeTheme: ThemeDefinition = {
  id: 'forge',
  name: 'Forge Manufacturing',
  description:
    'A focused company site for industrial teams, built around capabilities, projects, insights, and trust.',
  category: 'Industrial',
  ThemeLayout,
  SectionRegistry,
  BlockRegistry,
  defaultSettingsData,
  settingsSchemaData: settingsSchemaData as GlobalSettingsSchema,
  templateCatalog,
  getTemplate,
  normalizeTemplate: (template: TemplateData) => template,
}
