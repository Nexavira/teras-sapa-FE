import React from 'react'

import styled from '@emotion/styled'

import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyQuoteSettings {
  quote?: string
  highlight?: string
  color_scheme?: string
}

const SectionContainer = styled.section<{
  dark?: boolean
  framed?: boolean
}>`
  position: relative;
  width: ${({ framed }) =>
    framed ? 'calc(100% - 16px)' : 'min(100%, var(--forge-page-width))'};
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  border-radius: ${({ framed }) => (framed ? 'var(--forge-card-radius)' : '0')};
  background: ${({ dark, framed }) =>
    dark
      ? 'var(--forge-ink)'
      : framed
        ? 'var(--gradient-background, rgb(var(--color-background)))'
        : 'transparent'};
  color: ${({ dark, framed }) =>
    dark
      ? 'var(--forge-paper)'
      : framed
        ? 'rgb(var(--color-foreground))'
        : 'inherit'};
  box-shadow: ${({ dark }) =>
    dark ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
    border-radius: ${({ framed }) => (framed ? 'var(--forge-media-radius)' : '0')};
  }
`

const AmbientWatermark = styled.div`
  position: absolute;
  top: -16px;
  right: 28px;
  width: 260px;
  height: 200px;
  pointer-events: none;
  opacity: 0.035;
  color: currentColor;
  user-select: none;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 767px) {
    display: none;
  }
`

const QuoteContentWrapper = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0;
  display: flex;
  flex-direction: column;
`

const QuotationIconWrapper = styled.div`
  color: var(--forge-orange);
  margin-bottom: clamp(24px, 3.5vw, 36px);
  width: 44px;
  height: 32px;
  display: flex;
  align-items: center;
  transition: transform 600ms var(--forge-ease);

  &:hover {
    transform: scale(1.05) translateY(-2px);
  }

  svg {
    width: 100%;
    height: 100%;
  }
`

const QuoteText = styled.blockquote`
  margin: 0;
  font-family: var(--forge-heading);
  font-weight: var(--forge-heading-weight, 520);
  font-size: calc(clamp(38px, 5.8vw, 82px) * var(--forge-heading-scale, 1));
  line-height: 1.04;
  letter-spacing: var(--forge-heading-letter-spacing, -0.055em);
  text-transform: var(--forge-heading-text-transform, none);
  text-wrap: balance;
  color: inherit;

  em {
    color: var(--forge-orange);
    font-style: normal;
    font-weight: 560;
    position: relative;
    display: inline;
  }
`

const AccentRule = styled.div`
  display: flex;
  align-items: center;
  margin-top: clamp(36px, 4.5vw, 54px);
  width: 100%;
  max-width: 1060px;
  position: relative;

  &::before {
    content: '';
    width: 64px;
    height: 2px;
    background: var(--forge-orange);
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.1;
    margin-left: 16px;
  }
`

const QuoteMarkSvg: React.FC = () => (
  <svg viewBox="0 0 44 32" fill="currentColor" aria-hidden="true">
    <path d="M12.8 0C5.7 0 0 5.4 0 12.1c0 6.6 5.3 12 12.1 12.1h1.9C12.3 28.5 8 31.4 3 32v0c10.4-.6 16.9-7.9 16.9-18.9V0H12.8zm24.3 0c-7.1 0-12.8 5.4-12.8 12.1 0 6.6 5.3 12 12.1 12.1h1.9c-1.7 4.3-6 7.2-11 7.8v0c10.4-.6 16.9-7.9 16.9-18.9V0H37.1z" />
  </svg>
)

export const CompanyQuote: React.FC<
  SectionComponentProps<CompanyQuoteSettings>
> = ({ id, settings, isEditor = false }) => {
  const rootRef = useReveal()
  const {
    quote = 'We make the critical parts behind everyday momentum.',
    highlight = 'everyday momentum.',
    color_scheme,
  } = settings

  const resolvedColorScheme = color_scheme || 'scheme-1'
  const isDark = resolvedColorScheme === 'scheme-2'
  const isFramed =
    isDark || (Boolean(color_scheme) && color_scheme !== 'scheme-1')

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
    <SectionContainer
      id={id}
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      dark={isDark}
      framed={isFramed}
      ref={rootRef}
    >
      <AmbientWatermark>
        <QuoteMarkSvg />
      </AmbientWatermark>

      <QuoteContentWrapper>
        <Reveal isEditor={isEditor}>
          <QuotationIconWrapper>
            <QuoteMarkSvg />
          </QuotationIconWrapper>
          <QuoteText>{quoteContent}</QuoteText>
          <AccentRule />
        </Reveal>
      </QuoteContentWrapper>
    </SectionContainer>
  )
}
