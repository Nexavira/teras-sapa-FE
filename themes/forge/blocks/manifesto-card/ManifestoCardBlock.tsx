import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ManifestoCardSettings {
  quote?: string
  show_glyph?: boolean
  label?: string
  stamp?: string
}

const ManifestoShell = styled.div`
  position: relative;
  width: 100%;
  padding: clamp(32px, 4vw, 54px);
  border-radius: var(--forge-card-radius, 28px);
  background: rgba(currentColor, 0.035);
  border: 1px solid rgba(currentColor, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 20px 48px -12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: inherit;
`

const QuoteGlyphWrapper = styled.div`
  color: var(--forge-orange);
  width: 36px;
  height: 26px;
  display: flex;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`

const QuoteText = styled.blockquote`
  margin: 0;
  padding: 0;
  font: 450 clamp(19px, 2.1vw, 26px) / 1.55 var(--forge-heading);
  letter-spacing: -0.02em;
  color: inherit;
`

const QuoteGlyphSvg: React.FC = () => (
  <svg viewBox="0 0 44 32" fill="currentColor" aria-hidden="true">
    <path d="M12.8 0C5.7 0 0 5.4 0 12.1c0 6.6 5.3 12 12.1 12.1h1.9C12.3 28.5 8 31.4 3 32v0c10.4-.6 16.9-7.9 16.9-18.9V0H12.8zm24.3 0c-7.1 0-12.8 5.4-12.8 12.1 0 6.6 5.3 12 12.1 12.1h1.9c-1.7 4.3-6 7.2-11 7.8v0c10.4-.6 16.9-7.9 16.9-18.9V0H37.1z" />
  </svg>
)

export const ManifestoCardBlock: React.FC<
  BlockComponentProps<ManifestoCardSettings>
> = ({ settings, ...restProps }) => {
  const {
    quote = 'Capability earns attention. Consistency earns trust.',
    show_glyph = true,
  } = settings

  return (
    <ManifestoShell {...restProps}>
      {show_glyph && (
        <QuoteGlyphWrapper>
          <QuoteGlyphSvg />
        </QuoteGlyphWrapper>
      )}
      {quote && <QuoteText>{quote}</QuoteText>}
    </ManifestoShell>
  )
}
