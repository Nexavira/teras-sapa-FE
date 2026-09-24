import defaultSettingsData from './config/settings_data.json'
import settingsSchemaData from './config/settings_schema.json'
import { ThemeLayout } from './layout/ThemeLayout'
import { BlockRegistry, SectionRegistry } from './registry'
import { normalizeFeaturedCollections } from './sections/featured-collection/featuredCollectionBlocks'
import { normalizeImageWithText } from './sections/image-with-text/imageWithTextBlocks'
import { getTemplate, templateCatalog } from './templates/catalog'
import type {
  GlobalSettingsSchema,
  TemplateData,
  ThemeDefinition,
} from '#themes/shared/types/theme'

export * from './blocks/announcement'
export * from './blocks/BlockRenderer'
export * from './blocks/button'
export * from './blocks/heading'
export * from './blocks/text'
export * from './layout/ThemeLayout'
export * from './registry'
export * from './sections/featured-collection'
export * from './sections/header'
export * from './sections/hero-banner'
export * from './sections/image-with-text'
export * from './snippets'

export function normalizeTemplate(template: TemplateData): TemplateData {
  return normalizeImageWithText(normalizeFeaturedCollections(template))
}

export const dawnTheme: ThemeDefinition = {
  id: 'dawn',
  name: 'Dawn',
  description:
    'A flexible storefront for product-led brands, with spacious merchandising and familiar shopping patterns.',
  category: 'Commerce',
  ThemeLayout,
  SectionRegistry,
  BlockRegistry,
  defaultSettingsData,
  settingsSchemaData: settingsSchemaData as GlobalSettingsSchema,
  templateCatalog,
  getTemplate,
  normalizeTemplate,
}
