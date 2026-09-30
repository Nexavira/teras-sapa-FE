import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ArticleQuoteSettings {
  quote?: string
}

const QuoteWrapper = styled.blockquote`
  margin: 54px 0;
  padding: 28px 0;
  box-shadow:
    inset 0 1px var(--forge-orange),
    inset 0 -1px var(--forge-orange);
  color: var(--forge-ink);
  font: 520 clamp(28px, 3vw, 42px) / 1.15 var(--forge-heading);
  letter-spacing: -0.04em;
`

export const ArticleQuoteBlock: React.FC<
  BlockComponentProps<ArticleQuoteSettings>
> = ({ settings, ...restProps }) => {
  const { quote } = settings

  if (!quote) return null

  return <QuoteWrapper {...restProps}>{quote}</QuoteWrapper>
}
