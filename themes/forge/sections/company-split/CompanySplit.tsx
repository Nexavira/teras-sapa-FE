import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type { SectionComponentProps } from '#themes/shared/types/theme'

export interface CompanySplitSettings {
  color_scheme?: string
  eyebrow?: string
  heading?: string
  intro?: string
  dark_mode?: boolean
  watermark_text?: string
  show_watermark?: boolean
  accent_tag?: string
}

const SectionContainer = styled.section<{ dark?: boolean; framed?: boolean }>`
  position: relative;
  overflow: hidden;
  width: ${({ framed }) =>
    framed ? 'calc(100% - 16px)' : 'min(100%, var(--forge-page-width))'};
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  border-radius: ${({ framed }) => (framed ? 'var(--forge-card-radius)' : '0')};
  background: ${({ dark, framed }) =>
    dark
      ? 'linear-gradient(180deg, #1b1e19 0%, var(--forge-ink) 100%)'
      : framed
        ? 'var(--gradient-background, rgb(var(--color-background)))'
        : 'transparent'};
  color: ${({ dark, framed }) =>
    dark
      ? 'var(--forge-paper)'
      : framed
        ? 'rgb(var(--color-foreground))'
        : 'inherit'};
  border: ${({ dark }) =>
    dark ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'};
  box-shadow: ${({ dark }) =>
    dark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 24px 64px -16px rgba(0, 0, 0, 0.45)'
      : 'none'};
  box-sizing: border-box;

  /* Ambient radial gradient orb for dark mode */
  ${({ dark }) =>
    dark &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -80px;
      right: -60px;
      width: 560px;
      height: 440px;
      background: radial-gradient(ellipse at center, rgba(241, 90, 36, 0.07) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }
  `}

  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
    border-radius: ${({ framed }) => (framed ? 'var(--forge-media-radius)' : '0')};
  }
`

const AmbientWatermark = styled.div<{ dark?: boolean }>`
  position: absolute;
  bottom: 28px;
  right: 36px;
  pointer-events: none;
  user-select: none;
  opacity: ${({ dark }) => (dark ? 0.045 : 0.03)};
  color: currentColor;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  font-family: var(--forge-heading);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  z-index: 0;

  svg {
    width: 54px;
    height: 54px;
  }

  @media (max-width: 960px) {
    display: none;
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
  box-shadow: ${({ dark }) =>
    dark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.6)'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--forge-orange);
    box-shadow: 0 0 8px var(--forge-orange);
  }
`

const H2 = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0;
  font: 520 clamp(38px, 5.4vw, 78px) / 0.95 var(--forge-heading);
  letter-spacing: -0.055em;
  text-wrap: balance;
`

const AccentRuler = styled.div<{ dark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: clamp(28px, 3.5vw, 40px);
  max-width: 460px;

  .accent-bar {
    width: 44px;
    height: 2px;
    background: var(--forge-orange);
    flex-shrink: 0;
    border-radius: 1px;
  }

  .accent-line {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: ${({ dark }) => (dark ? 0.16 : 0.12)};
  }

  .accent-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: ${({ dark }) => (dark ? 0.5 : 0.45)};
    font-family: var(--forge-heading);
    flex-shrink: 0;
  }
`

const LeftIntro = styled.p<{ dark?: boolean }>`
  max-width: 580px;
  margin: 28px 0 0 0;
  padding-left: 18px;
  border-left: 2px solid var(--forge-orange);
  color: ${({ dark }) => (dark ? 'rgba(244, 241, 233, 0.72)' : '#4a4d46')};
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.6;
  letter-spacing: -0.015em;
`

const SplitGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: clamp(48px, 8vw, 128px);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`

const ManifestoShell = styled.div<{ dark?: boolean }>`
  position: relative;
  width: 100%;
  padding: clamp(32px, 4vw, 54px);
  border-radius: var(--forge-card-radius, 28px);
  background: ${({ dark }) =>
    dark ? 'rgba(255, 255, 255, 0.035)' : 'rgba(23, 25, 21, 0.03)'};
  border: 1px solid
    ${({ dark }) =>
      dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(23, 25, 21, 0.08)'};
  box-shadow: ${({ dark }) =>
    dark
      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 20px 48px -12px rgba(0, 0, 0, 0.3)'
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 16px 36px -12px rgba(23, 25, 21, 0.05)'};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

const ManifestoQuoteGlyph = styled.div`
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

const ManifestoText = styled.blockquote<{ dark?: boolean }>`
  margin: 0;
  padding: 0;
  font: 450 clamp(19px, 2.1vw, 26px) / 1.55 var(--forge-heading);
  letter-spacing: -0.02em;
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'inherit')};
`

const ManifestoFooter = styled.div<{ dark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid
    ${({ dark }) =>
      dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(23, 25, 21, 0.08)'};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  opacity: ${({ dark }) => (dark ? 0.6 : 0.5)};
  font-family: var(--forge-heading);

  .stamp {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--forge-orange);
    opacity: 1;
  }
`

const CompassSvg: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" strokeOpacity="0.4" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
    <path d="M24 4v4M24 40v4M4 24h4M40 24h4" />
    <path d="M10 10l5 5M33 33l5 5M10 38l5-5M33 15l5-5" strokeOpacity="0.3" />
  </svg>
)

const QuoteGlyphSvg: React.FC = () => (
  <svg viewBox="0 0 44 32" fill="currentColor" aria-hidden="true">
    <path d="M12.8 0C5.7 0 0 5.4 0 12.1c0 6.6 5.3 12 12.1 12.1h1.9C12.3 28.5 8 31.4 3 32v0c10.4-.6 16.9-7.9 16.9-18.9V0H12.8zm24.3 0c-7.1 0-12.8 5.4-12.8 12.1 0 6.6 5.3 12 12.1 12.1h1.9c-1.7 4.3-6 7.2-11 7.8v0c10.4-.6 16.9-7.9 16.9-18.9V0H37.1z" />
  </svg>
)

export const CompanySplit: React.FC<
  SectionComponentProps<CompanySplitSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()
  const {
    color_scheme,
    eyebrow,
    heading = 'Capability earns attention. Consistency earns trust.',
    intro,
    dark_mode = false,
    watermark_text = 'Atlas Ref. Spec 02',
    show_watermark = true,
    accent_tag,
  } = settings

  const resolvedColorScheme =
    color_scheme || (dark_mode ? 'scheme-2' : 'scheme-1')
  const isDark = resolvedColorScheme === 'scheme-2' || Boolean(dark_mode)
  const isFramed =
    isDark || (Boolean(color_scheme) && color_scheme !== 'scheme-1')

  const isLeftBlock = (blockId: string) => {
    const block = blocks[blockId]
    if (!block?.type) return false
    if (block.settings?.column === 'left') return true
    if (block.settings?.column === 'right') return false
    const type = block.type
    return (
      type === 'heading' ||
      type === 'text' ||
      type === 'button' ||
      type === 'accent_ruler'
    )
  }

  const leftBlockIds = blockOrder.filter(isLeftBlock)
  const rightBlockIds = blockOrder.filter((blockId) => !isLeftBlock(blockId))

  const hasLeftBlocks = leftBlockIds.length > 0
  const hasRightBlocks = rightBlockIds.length > 0

  const renderBlock = (blockId: string) => {
    const block = blocks[blockId]
    if (!block?.type) return null
    return (
      <BlockRenderer
        block={block}
        blockId={blockId}
        isEditor={isEditor}
        key={blockId}
        sectionId={id}
      />
    )
  }

  return (
    <SectionContainer
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      dark={isDark}
      framed={isFramed}
      id={id}
      ref={rootRef}
    >
      {show_watermark && (
        <AmbientWatermark dark={isDark}>
          <CompassSvg />
          <span>{watermark_text || 'Atlas Ref. Spec 02'}</span>
        </AmbientWatermark>
      )}

      <SplitGrid>
        <Reveal isEditor={isEditor}>
          <LeftColumn>
            {hasLeftBlocks ? (
              leftBlockIds.map(renderBlock)
            ) : (
              <>
                {eyebrow && <Eyebrow dark={isDark}>{eyebrow}</Eyebrow>}
                {heading && <H2>{heading}</H2>}
                {hasRightBlocks && intro && (
                  <LeftIntro dark={isDark}>{intro}</LeftIntro>
                )}
                <AccentRuler dark={isDark}>
                  <div className="accent-bar" />
                  <div className="accent-line" />
                  <div className="accent-tag">
                    {accent_tag || (isDark ? 'INDEX / 02' : 'PHILOSOPHY')}
                  </div>
                </AccentRuler>
              </>
            )}
          </LeftColumn>
        </Reveal>

        <Reveal isEditor={isEditor}>
          {hasRightBlocks ? (
            <RightColumn>{rightBlockIds.map(renderBlock)}</RightColumn>
          ) : (
            <ManifestoShell dark={isDark}>
              <ManifestoQuoteGlyph>
                <QuoteGlyphSvg />
              </ManifestoQuoteGlyph>
              {intro && (
                <ManifestoText dark={isDark}>{intro}</ManifestoText>
              )}
              <ManifestoFooter dark={isDark}>
                <span>Operational Benchmark</span>
                <span className="stamp">● Verified Standard</span>
              </ManifestoFooter>
            </ManifestoShell>
          )}
        </Reveal>
      </SplitGrid>
    </SectionContainer>
  )
}

