import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanyMetricsSettings {
  heading?: string
  color_scheme?: string
  dark_mode?: boolean
}

const SectionContainer = styled.section<{ dark?: boolean; framed?: boolean }>`
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

const HeaderArea = styled.div`
  margin-bottom: 48px;
`

const H2 = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0;
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

const FallbackMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--forge-grid-gap);

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 0.75fr 0.75fr;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

export const CompanyMetrics: React.FC<
  SectionComponentProps<CompanyMetricsSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const { heading, color_scheme, dark_mode = false } = settings

  const resolvedColorScheme =
    color_scheme || (dark_mode ? 'scheme-2' : 'scheme-1')
  const isDark = resolvedColorScheme === 'scheme-2' || Boolean(dark_mode)
  const isFramed =
    isDark || (Boolean(color_scheme) && color_scheme !== 'scheme-1')

  // When blocks are directly metric_item blocks without a grid container, maintain legacy grid layout
  const isDirectLegacyMetrics =
    blockOrder.length > 0 &&
    blockOrder.every((blockId) => blocks[blockId]?.type === 'metric_item')

  const hasHeadingBlock = blockOrder.some(
    (blockId) => blocks[blockId]?.type === 'heading',
  )
  const showFallbackHeading = !hasHeadingBlock && Boolean(heading)

  const renderBlocks = () => {
    if (blockOrder.length === 0) return null

    if (isDirectLegacyMetrics) {
      return (
        <FallbackMetricsGrid>
          {blockOrder.map((blockId) => (
            <BlockRenderer
              block={blocks[blockId]}
              blockId={blockId}
              isEditor={isEditor}
              key={blockId}
              sectionId={id}
            />
          ))}
        </FallbackMetricsGrid>
      )
    }

    return (
      <BlocksContainer>
        {blockOrder.map((blockId) => (
          <BlockRenderer
            block={blocks[blockId]}
            blockId={blockId}
            isEditor={isEditor}
            key={blockId}
            sectionId={id}
          />
        ))}
      </BlocksContainer>
    )
  }

  return (
    <SectionContainer
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      dark={isDark}
      framed={isFramed}
      ref={rootRef}
    >
      {showFallbackHeading && (
        <HeaderArea>
          <Reveal isEditor={isEditor}>
            <H2>{heading}</H2>
          </Reveal>
        </HeaderArea>
      )}

      {renderBlocks()}
    </SectionContainer>
  )
}
