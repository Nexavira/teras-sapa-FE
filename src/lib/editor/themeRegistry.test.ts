import { describe, expect, it } from 'vitest'

import {
  dawnTheme,
  DEFAULT_THEME_ID,
  forgeTheme,
  getTheme,
  themeRegistry,
} from '#themes'

describe('theme registry', () => {
  it('registers Dawn as the default theme', () => {
    expect(DEFAULT_THEME_ID).toBe('dawn')
    expect(themeRegistry.dawn).toBe(dawnTheme)
    expect(getTheme()).toBe(dawnTheme)
  })

  it('falls back to the default theme for an unknown id', () => {
    expect(getTheme('missing-theme')).toBe(dawnTheme)
  })

  it('registers the Forge manufacturing theme', () => {
    expect(themeRegistry.forge).toBe(forgeTheme)
    expect(getTheme('forge')).toBe(forgeTheme)
    expect(Object.keys(forgeTheme.templateCatalog)).toEqual([
      'index',
      'about',
      'capabilities',
      'industries',
      'projects',
      'sustainability',
      'insights',
      'article',
      'careers',
      'contact',
    ])
  })
})
