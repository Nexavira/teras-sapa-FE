export const theme = {
  colors: {
    primary: {
      '100': '#C8FAD4',
      '200': '#93F6B5',
      '300': '#5BE497',
      '400': '#32CA84',
      '500': '#00A86B',
      '600': '#00906A',
      '700': '#007864',
      '800': '#00615A',
      '900': '#004D50',

      DEFAULT: '#00A86B',
      DARKER: '#00615A',
      LIGHTER: '#C8FAD4',
    },
    secondary: {
      '100': '#C8FAE4',
      '200': '#93F6D3',
      '300': '#5BE4C0',
      '400': '#32C9B0',
      '500': '#00A699',
      '600': '#008D8E',
      '700': '#006B77',
      '800': '#004D60',
      '900': '#00394F',

      DEFAULT: '#00A699',
      DARKER: '#004D60',
      LIGHTER: '#C8FAE4',
    },
    background: '#FFFFFF',

    gray: {
      '100': '#f4f4f5',
      '200': '#e4e4e7',
      '300': '#d4d4d8',
      '400': '#a1a1aa',
      '500': '#71717a',
      '600': '#52525b',
      '700': '#3f3f46',
      '800': '#27272a',
      '900': '#18181b',

      DEFAULT: '#71717a',
      DARKER: '#18181b',
      LIGHTER: '#f4f4f5',
    },

    text: {
      primary: '#18181b',
      secondary: '#71717a',
      inverse: '#FFFFFF',
    },

    border: '#e4e4e7',
    error: '#DB4153',
    success: '#32C9B0',
    muted: '#F4F4F5',
  },
  typography: {
    fontFamily:
      'Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    sizes: {
      caption: '12px',
      body: '16px',
      title: '24px',
      display: '32px',
    },
    lineHeights: {
      normal: 1.5,
      tight: 1.25,
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
}

export type Theme = typeof theme
