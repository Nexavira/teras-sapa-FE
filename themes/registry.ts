import { dawnTheme } from './dawn'
import { forgeTheme } from './forge'
import type { ThemeDefinition } from './shared/types/theme'

export const DEFAULT_THEME_ID = 'dawn'

export const themeRegistry = {
  dawn: dawnTheme,
  forge: forgeTheme,
} satisfies Record<string, ThemeDefinition>

export type ThemeId = keyof typeof themeRegistry

export function getTheme(themeId: string = DEFAULT_THEME_ID): ThemeDefinition {
  if (Object.hasOwn(themeRegistry, themeId)) {
    return themeRegistry[themeId as ThemeId]
  }

  return themeRegistry[DEFAULT_THEME_ID]
}
