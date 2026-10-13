import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyBentoSettings {
  color_scheme?: string
  dark_mode?: boolean
  /** Legacy fallback settings */
  eyebrow?: string
  heading?: string
  cta_label?: string
  cta_url?: string
}

const SectionContainer = styled.section<{
  dark?: boolean
  framed?: boolean
}>`
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

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
    border-radius: ${({ framed }) => (framed ? 'var(--forge-media-radius)' : '0')};
  }
`

const Eyebrow = styled.p<{ dark?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 24px;
  padding: 7px 14px 7px 10px;
  border-radius: var(--forge-pill-radius);
  background: ${({ dark }) =>
    dark ? 'rgba(244, 241, 233, 0.08)' : 'rgba(23, 25, 21, 0.05)'};
  border: 1px solid
    ${({ dark }) =>
      dark ? 'rgba(244, 241, 233, 0.14)' : 'rgba(23, 25, 21, 0.08)'};
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'inherit')};
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.22em;
  text-transform: uppercase;
`

const H2 = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0 0 32px;
  font: 520 clamp(42px, 6.1vw, 88px) / 0.93 var(--forge-heading);
  letter-spacing: -0.065em;
  text-wrap: balance;
`

const BlocksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--forge-grid-gap);
  width: 100%;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

const ArrowLink = styled.a<{ dark?: boolean }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 13px;
  margin-top: 40px;
  padding: 6px 7px 6px 18px;
  border-radius: var(--forge-button-radius);
  background: ${({ dark }) =>
    dark ? 'var(--forge-paper)' : 'var(--forge-ink)'};
  color: ${({ dark }) => (dark ? 'var(--forge-ink)' : 'var(--forge-paper)')};
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  transition: transform 650ms var(--forge-ease);

  span {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }

  &:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`

export const CompanyBento: React.FC<
  SectionComponentProps<CompanyBentoSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const {
    color_scheme,
    dark_mode = true,
    eyebrow,
    heading,
    cta_label,
    cta_url,
  } = settings

  const resolvedColorScheme =
    color_scheme || (dark_mode ? 'scheme-2' : 'scheme-1')
  const isDark = resolvedColorScheme === 'scheme-2' || Boolean(dark_mode)
  const isFramed =
    isDark || (Boolean(color_scheme) && color_scheme !== 'scheme-1')

  const hasHeadingBlock = blockOrder.some(
    (blockId) => blocks[blockId]?.type === 'heading',
  )
  const showFallbackHeading = !hasHeadingBlock && Boolean(heading)

  const hasButtonBlock = blockOrder.some(
    (blockId) => blocks[blockId]?.type === 'button',
  )
  const showFallbackCta =
    !hasButtonBlock && Boolean(cta_label) && Boolean(cta_url)

  const renderBlocks = () => {
    if (blockOrder.length === 0) return null

    // Group consecutive bento_card blocks into BentoGrid
    const elements: Array<React.ReactNode> = []
    let currentBentoCards: Array<string> = []

    const flushBentoCards = (keyPrefix: string) => {
      if (currentBentoCards.length === 0) return
      const cardIds = [...currentBentoCards]
      elements.push(
        <BentoGrid key={`bento-grid-group-${keyPrefix}`}>
          {cardIds.map((cardId) => (
            <BlockRenderer
              block={blocks[cardId]}
              blockId={cardId}
              isEditor={isEditor}
              key={cardId}
              sectionId={id}
            />
          ))}
        </BentoGrid>,
      )
      currentBentoCards = []
    }

    blockOrder.forEach((blockId, index) => {
      const block = blocks[blockId]
      if (!block) return

      if (block.type === 'bento_card') {
        currentBentoCards.push(blockId)
      } else {
        flushBentoCards(`before-${index}`)
        elements.push(
          <BlockRenderer
            block={block}
            blockId={blockId}
            isEditor={isEditor}
            key={blockId}
            sectionId={id}
          />,
        )
      }
    })

    flushBentoCards('end')

    return <BlocksContainer>{elements}</BlocksContainer>
  }

  return (
    <SectionContainer
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      dark={isDark}
      framed={isFramed}
      ref={rootRef}
    >
      {eyebrow && (
        <Reveal isEditor={isEditor}>
          <Eyebrow dark={isDark}>{eyebrow}</Eyebrow>
        </Reveal>
      )}

      {showFallbackHeading && (
        <Reveal isEditor={isEditor}>
          <H2>{heading}</H2>
        </Reveal>
      )}

      {renderBlocks()}

      {showFallbackCta && (
        <ArrowLink dark={isDark} href={cta_url}>
          {cta_label} <span>↗</span>
        </ArrowLink>
      )}
    </SectionContainer>
  )
}
