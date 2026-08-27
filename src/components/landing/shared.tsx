import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Button, Card, Typography } from '#/components/ui'

export const landingColors = {
  emerald: '#00a86b',
  emeraldDark: '#008655',
  ink: '#111111',
  black: '#050505',
  paper: '#f8f8f8',
  white: '#ffffff',
  muted: '#6b7280',
}

export const landingGlobalStyles = css`
  html {
    scroll-behavior: auto;
  }

  html.lenis,
  html.lenis body {
    height: auto;
  }

  .lenis:not(.lenis-autoToggle).lenis-stopped {
    overflow: clip;
  }

  .lenis [data-lenis-prevent] {
    overscroll-behavior: contain;
  }

  .lenis.lenis-smooth iframe {
    pointer-events: none;
  }

  body {
    overflow-x: hidden;
  }

  [data-landing-root],
  [data-landing-root] * {
    box-sizing: border-box;
  }

  [data-landing-root] a {
    color: inherit;
    text-decoration: none;
  }

  @media (pointer: fine) and (min-width: 769px) {
    [data-landing-root],
    [data-landing-root] a,
    [data-landing-root] button {
      cursor: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    [data-landing-root] *,
    [data-landing-root] *::before,
    [data-landing-root] *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`

export const LandingRoot = styled.main`
  min-height: 100vh;
  overflow: clip;
  background: ${landingColors.paper};
  color: ${landingColors.ink};
  font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
`

export const Container = styled.div`
  width: min(100% - 64px, 1280px);
  margin-inline: auto;

  @media (max-width: 720px) {
    width: min(100% - 32px, 1280px);
  }
`

export const Wordmark = styled.a`
  display: inline-flex;
  align-items: baseline;
  color: ${landingColors.white};
  font-size: clamp(1.45rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.07em;

  span {
    color: ${landingColors.emerald};
  }
`

export const SectionHeading = styled(Typography)`
  display: block;
  color: inherit;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 800;
  line-height: 0.93;
  letter-spacing: -0.035em;
  text-transform: uppercase;
`

export const BodyCopy = styled(Typography)`
  display: block;
  color: inherit;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  font-weight: 400;
  line-height: 1.65;
`

export const EmeraldButton = styled(Button)`
  && {
    gap: 12px;
    min-height: 52px;
    padding: 14px 28px;
    border: 1px solid ${landingColors.emerald};
    border-radius: 999px;
    background: ${landingColors.emerald};
    color: ${landingColors.white};
    font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;

    &:hover:not(:disabled) {
      background: ${landingColors.emeraldDark};
      border-color: ${landingColors.emeraldDark};
      opacity: 1;
      transform: translateY(-2px);
    }
  }
`

export const LightButton = styled(Button)`
  && {
    min-height: 44px;
    padding: 10px 24px;
    border: 1px solid ${landingColors.white};
    border-radius: 999px;
    background: ${landingColors.white};
    color: ${landingColors.ink};
    font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.8rem;
    font-weight: 700;

    &:hover:not(:disabled) {
      background: ${landingColors.emerald};
      border-color: ${landingColors.emerald};
      color: ${landingColors.white};
      opacity: 1;
      transform: translateY(-2px);
    }
  }
`

export const OutlineButton = styled(Button)`
  && {
    min-height: 64px;
    padding: 18px 36px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 999px;
    background: transparent;
    color: ${landingColors.white};
    font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    &:hover:not(:disabled) {
      background: ${landingColors.emerald};
      border-color: ${landingColors.emerald};
      color: ${landingColors.white};
      opacity: 1;
    }
  }
`

export const LandingCard = styled(Card)`
  border: 0;
  border-radius: 12px;
  font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
`

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`
