export const theme = {
  colors: {
    primary: '#FF5A5F', // Airbnb Red
    secondary: '#00A699', // Airbnb Teal
    background: '#FFFFFF',
    text: {
      primary: '#484848', // Dark gray
      secondary: '#767676', // Muted gray
      inverse: '#FFFFFF',
    },
    border: '#EBEBEB',
    error: '#C13515',
    success: '#008A05',
    muted: '#F7F7F7',
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
