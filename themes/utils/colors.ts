import type { ColorSchemesData } from '#themes/types/theme'

/**
 * Converts a hex color (e.g. #FFFFFF, #fff, #121212) into an RGB tuple string (e.g. "255, 255, 255").
 * Matches Shopify Liquid's `color_to_rgb` filter behavior for CSS custom properties.
 */
export function hexToRgb(hex: string): string {
  if (!hex) return '0, 0, 0'

  // If already rgb/rgba format, extract numbers
  if (hex.startsWith('rgb')) {
    const match = hex.match(/\(([^)]+)\)/)
    if (match) {
      const parts = match[1].split(',').slice(0, 3)
      return parts.map((p) => p.trim()).join(', ')
    }
  }

  // Clean hex string
  let cleanHex = hex.replace('#', '').trim()

  // Handle 3-character hex (#fff -> #ffffff)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  if (cleanHex.length !== 6) {
    return '0, 0, 0'
  }

  const num = parseInt(cleanHex, 16)
  if (isNaN(num)) return '0, 0, 0'

  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  return `${r}, ${g}, ${b}`
}

/**
 * Converts a hex color (e.g. #FFFFFF, #fff, #121212) into an RGBA tuple string (e.g. "255, 255, 255, 0.5").
 * Matches Shopify Liquid's `color_to_rgba` filter behavior for CSS custom properties.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  return `rgba(${rgb}, ${alpha})`
}

/**
 * Generates scoped CSS variable blocks for all color schemes in settings_data.
 * Exactly mirrors Shopify Dawn's `base.css` color scheme engine.
 */
export function generateColorSchemeCss(
  colorSchemes: ColorSchemesData = {},
): string {
  const schemeKeys = Object.keys(colorSchemes)
  if (schemeKeys.length === 0) {
    return ''
  }

  let cssOutput = ''

  // 1. Root default variables (derived from first scheme or fallback)
  const defaultScheme = colorSchemes[schemeKeys[0]]

  let s = defaultScheme.settings
  let bgRgb = hexToRgb(s.background || '#FFFFFF')
  let textRgb = hexToRgb(s.text || '#121212')
  let btnRgb = hexToRgb(s.button || '#121212')
  let btnTextRgb = hexToRgb(s.button_label || '#FFFFFF')
  let secBtnRgb = hexToRgb(s.secondary_button_label || '#121212')
  let shadowRgb = hexToRgb(s.shadow || '#121212')
  let gradient = s.background_gradient || s.background || '#FFFFFF'

  cssOutput += `
      :root {
        --color-background: ${bgRgb};
        --gradient-background: ${gradient};
        --color-foreground: ${textRgb};
        --color-button: ${btnRgb};
        --color-button-text: ${btnTextRgb};
        --color-secondary-button: ${secBtnRgb};
        --color-secondary-button-text: ${secBtnRgb};
        --color-shadow: ${shadowRgb};
        --color-border: rgba(var(--color-foreground), 0.12);
        --color-card: rgba(var(--color-foreground), 0.04);
        --color-card-border: rgba(var(--color-foreground), 0.08);

        /* Default surface / page styling */
        --color-bg: rgb(var(--color-background));
        --color-text: rgb(var(--color-foreground));
        --color-accent: rgb(var(--color-button));
      }
    `

  // 2. Scoped CSS classes for each individual scheme (.color-scheme-1, .color-scheme-2, etc.)
  schemeKeys.forEach((schemeKey) => {
    const scheme = colorSchemes[schemeKey]

    s = scheme.settings
    bgRgb = hexToRgb(s.background || '#FFFFFF')
    textRgb = hexToRgb(s.text || '#121212')
    btnRgb = hexToRgb(s.button || '#121212')
    btnTextRgb = hexToRgb(s.button_label || '#FFFFFF')
    secBtnRgb = hexToRgb(s.secondary_button_label || '#121212')
    shadowRgb = hexToRgb(s.shadow || '#121212')
    gradient = s.background_gradient || s.background || '#FFFFFF'

    // Support both .color-scheme-1 and .color-scheme_1 / [data-color-scheme="scheme-1"]
    cssOutput += `
      .color-${schemeKey},
      [data-color-scheme="${schemeKey}"] {
        --color-background: ${bgRgb};
        --gradient-background: ${gradient};
        --color-foreground: ${textRgb};
        --color-button: ${btnRgb};
        --color-button-text: ${btnTextRgb};
        --color-secondary-button: ${secBtnRgb};
        --color-secondary-button-text: ${secBtnRgb};
        --color-shadow: ${shadowRgb};
        --color-border: rgba(var(--color-foreground), 0.12);
        --color-card: rgba(var(--color-foreground), 0.04);
        --color-card-border: rgba(var(--color-foreground), 0.08);

        color: rgb(var(--color-foreground));
        background-color: rgb(var(--color-background));
        background: var(--gradient-background, rgb(var(--color-background)));
      }
    `
  })

  return cssOutput
}
