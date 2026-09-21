import { describe, expect, it } from 'vitest'

import { dawnTheme, DEFAULT_THEME_ID, getTheme, themeRegistry } from '#themes'

describe('theme registry', () => {
  it('registers Dawn as the default theme', () => {
    expect(DEFAULT_THEME_ID).toBe('dawn')
    expect(themeRegistry.dawn).toBe(dawnTheme)
    expect(getTheme()).toBe(dawnTheme)
  })

  it('falls back to the default theme for an unknown id', () => {
    expect(getTheme('missing-theme')).toBe(dawnTheme)
  })
})
