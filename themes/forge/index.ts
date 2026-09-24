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

export * from './blocks/BlockRenderer'
export * from './blocks/button'
export * from './blocks/flex'
export * from './blocks/heading'
export * from './blocks/text'
export * from './layout/ThemeLayout'
export * from './registry'
export * from './sections/company-article'
export * from './sections/company-bento'
export * from './sections/company-hero'
export * from './sections/company-metrics'
export * from './sections/company-quote'
export * from './sections/company-split'

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
