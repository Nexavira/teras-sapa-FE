/**
 * Color math and conversion utilities for the ColorPicker component.
 * Supports HEX, RGB, RGBA, HSL, HSLA, HSV, and CSS Gradient strings.
 */

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export interface HSV {
  h: number // 0 - 360
  s: number // 0 - 100
  v: number // 0 - 100
  a: number // 0 - 1
}

export interface HSL {
  h: number // 0 - 360
  s: number // 0 - 100
  l: number // 0 - 100
  a: number // 0 - 1
}

// Convert HSV to RGBA
export function hsvToRgb(h: number, s: number, v: number, a = 1): RGBA {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  v = Math.max(0, Math.min(100, v)) / 100

  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r1 = 0
  let g1 = 0
  let b1 = 0

  if (h >= 0 && h < 60) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (h >= 60 && h < 120) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (h >= 120 && h < 180) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (h >= 180 && h < 240) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (h >= 240 && h < 300) {
    r1 = x
    g1 = 0
    b1 = c
  } else {
    r1 = c
    g1 = 0
    b1 = x
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: Math.max(0, Math.min(1, a)),
  }
}

// Convert RGBA to HSV
export function rgbToHsv(r: number, g: number, b: number, a = 1): HSV {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6
    } else if (max === g) {
      h = (b - r) / delta + 2
    } else {
      h = (r - g) / delta + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100)
  const v = Math.round(max * 100)

  return { h, s, v, a }
}

// Convert RGBA to HEX (e.g. #FFFFFF or #FFFFFFAA)
export function rgbToHex(r: number, g: number, b: number, a = 1): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  const hexR = toHex(r)
  const hexG = toHex(g)
  const hexB = toHex(b)

  if (a < 1) {
    const hexA = toHex(Math.round(a * 255))
    return `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase()
  }

  return `#${hexR}${hexG}${hexB}`.toUpperCase()
}

// Parse any color string (HEX, RGB, RGBA, HSL, HSLA, named colors) to RGBA
export function parseColorToRgb(colorStr: string): RGBA {
  if (!colorStr) return { r: 0, g: 0, b: 0, a: 1 }

  const str = colorStr.trim().toLowerCase()

  // 1. Transparent
  if (str === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  // 2. HEX (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
  if (str.startsWith('#')) {
    let hex = str.slice(1)
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16)
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
        a: 1,
      }
    }
    if (hex.length === 8) {
      const num = parseInt(hex, 16)
      return {
        r: (num >> 24) & 255,
        g: (num >> 16) & 255,
        b: (num >> 8) & 255,
        a: Math.round(((num & 255) / 255) * 100) / 100,
      }
    }
  }

  // 3. RGB / RGBA: rgb(r, g, b) or rgba(r, g, b, a)
  if (str.startsWith('rgb')) {
    const match = str.match(
      /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\)/,
    )
    if (match) {
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] ? parseFloat(match[4]) : 1,
      }
    }
  }

  // 4. HSL / HSLA: hsl(h, s%, l%)
  if (str.startsWith('hsl')) {
    const match = str.match(
      /hsla?\((\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?(?:[,\s/]+([\d.]+))?\)/,
    )
    if (match) {
      const h = parseInt(match[1], 10)
      const s = parseInt(match[2], 10)
      const l = parseInt(match[3], 10)
      const a = match[4] ? parseFloat(match[4]) : 1
      return hslToRgb(h, s, l, a)
    }
  }

  // Fallback
  return { r: 18, g: 18, b: 18, a: 1 }
}

// Convert HSL to RGBA
export function hslToRgb(h: number, s: number, l: number, a = 1): RGBA {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r1 = 0
  let g1 = 0
  let b1 = 0

  if (h >= 0 && h < 60) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (h >= 60 && h < 120) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (h >= 120 && h < 180) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (h >= 180 && h < 240) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (h >= 240 && h < 300) {
    r1 = x
    g1 = 0
    b1 = c
  } else {
    r1 = c
    g1 = 0
    b1 = x
  }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: Math.max(0, Math.min(1, a)),
  }
}

// Convert RGBA to HSL
export function rgbToHsl(r: number, g: number, b: number, a = 1): HSL {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) / 2

  let h = 0
  let s = 0

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === r) {
      h = ((g - b) / delta) % 6
    } else if (max === g) {
      h = (b - r) / delta + 2
    } else {
      h = (r - g) / delta + 4
    }
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a,
  }
}

// Is value a CSS gradient string?
export function isGradient(val?: string): boolean {
  if (!val) return false
  const lower = val.trim().toLowerCase()
  return (
    lower.startsWith('linear-gradient') ||
    lower.startsWith('radial-gradient') ||
    lower.startsWith('conic-gradient')
  )
}
