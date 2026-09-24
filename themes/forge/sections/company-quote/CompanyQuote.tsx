import React from 'react'

import styled from '@emotion/styled'

import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyQuoteSettings {
  quote?: string
  highlight?: string
}

const SectionContainer = styled.section`
  width: min(100%, var(--forge-page-width));
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  box-sizing: border-box;

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
  }
`

const Reveal = styled.div`
  opacity: 0;
  transform: translateY(54px);
  filter: blur(7px);
  transition:
    transform 900ms var(--forge-ease),
    opacity 900ms var(--forge-ease),
    filter 900ms var(--forge-ease);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`

const Quote = styled.blockquote`
  max-width: 1060px;
  margin: 0;
  font: 500 clamp(38px, 6vw, 82px) / 1 var(--forge-heading);
  letter-spacing: -0.06em;

  em {
    color: var(--forge-orange);
    font-style: normal;
  }
`

export const CompanyQuote: React.FC<
  SectionComponentProps<CompanyQuoteSettings>
> = ({ settings }) => {
  const rootRef = useReveal()
  const {
    quote = 'We make the critical parts behind everyday momentum.',
    highlight = 'everyday momentum.',
  } = settings

  let quoteContent: React.ReactNode = quote

  if (highlight && quote.includes(highlight)) {
    const parts = quote.split(highlight)
    quoteContent = (
      <>
        {parts[0]}
        <em>{highlight}</em>
        {parts.slice(1).join(highlight)}
      </>
    )
  }

  return (
    <SectionContainer ref={rootRef}>
      <Reveal data-reveal>
        <Quote>{quoteContent}</Quote>
      </Reveal>
    </SectionContainer>
  )
}
