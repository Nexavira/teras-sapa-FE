import { getTheme } from './registry'

export const activeTheme = getTheme()

export const {
  BlockRegistry,
  SectionRegistry,
  ThemeLayout,
  defaultSettingsData,
  getTemplate,
  normalizeTemplate,
  settingsSchemaData,
  templateCatalog,
} = activeTheme
