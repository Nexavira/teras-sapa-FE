import type { ReactNode } from 'react'
import { useState } from 'react'

import {
  CacheProvider,
  css,
  Global,
  ThemeProvider as EmotionThemeProvider,
} from '@emotion/react'

import createEmotionCache from './createEmotionCache'
import { theme } from './theme'

export interface ThemeProviderProps {
  children: ReactNode
}

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: ${theme.typography.fontFamily};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [cache] = useState(() => createEmotionCache())

  return (
    <CacheProvider value={cache}>
      <EmotionThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        {children}
      </EmotionThemeProvider>
    </CacheProvider>
  )
}
