import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type {
  ImageValue,
  SectionComponentProps,
} from '#themes/shared/types/theme'

export interface CompanyHeroSettings {
  layout_style?: 'frame' | 'banner' | 'split'
  text_alignment?: 'left' | 'center' | 'right'
  banner_height?: 'auto' | 'small' | 'medium' | 'large' | 'screen'
  media_height?: 'small' | 'medium' | 'large'
  color_scheme?: string
  /** Legacy templates are mapped to scheme-1 or scheme-2. */
  dark_mode?: boolean
  image?: string | ImageValue
  overlay_opacity?: number
  show_media?: boolean
  show_stamp?: boolean
  stamp_text?: string
  stamp_position?: 'bottom-right' | 'bottom-left' | 'top-right'
  stamp_color?: 'orange' | 'ink' | 'bone'
  padding_top?: number
  padding_bottom?: number
  // Fallback fields for backwards compatibility
  title?: string
  intro?: string
  button_label?: string
  button_link?: string
}

const defaultImage =
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88'

const HeroContainer = styled.section<{
  paddingTop?: number
  paddingBottom?: number
  minHeight?: string
  isBanner?: boolean
  bgImage?: string
}>`
  width: min(100%, var(--forge-page-width));
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  min-height: ${({ minHeight }) => minHeight || 'auto'};
  padding-top: ${({ paddingTop }) =>
    typeof paddingTop === 'number'
      ? `${paddingTop}px`
      : 'clamp(154px, 17vw, 232px)'};
  padding-bottom: ${({ paddingBottom }) =>
    typeof paddingBottom === 'number' ? `${paddingBottom}px` : '34px'};
  padding-left: clamp(18px, 5vw, 72px);
  padding-right: clamp(18px, 5vw, 72px);

  color: rgb(var(--color-foreground));
  background: var(--gradient-background, rgb(var(--color-background)));

  ${({ isBanner, bgImage }) =>
    isBanner && bgImage
      ? `
        background-image: url("${bgImage}");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      `
      : ''}

  @media (max-width: 767px) {
    width: 100%;
    padding-top: ${({ paddingTop }) =>
      typeof paddingTop === 'number'
        ? `${Math.max(100, paddingTop - 40)}px`
        : '120px'};
    padding-bottom: ${({ paddingBottom }) =>
      typeof paddingBottom === 'number' ? `${paddingBottom}px` : '34px'};
    padding-left: 16px;
    padding-right: 16px;
  }
`

const BannerOverlay = styled.div<{ opacity: number }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 17, 14, 0.76) 0%,
    rgba(15, 17, 14, 0.44) 60%,
    rgba(15, 17, 14, 0.22) 100%
  );
  opacity: ${({ opacity }) => opacity / 100};
  pointer-events: none;
`

const Reveal = styled.div<{ isEditor?: boolean }>`
  opacity: ${({ isEditor }) => (isEditor ? '1 !important' : '0')};
  transform: ${({ isEditor }) => (isEditor ? 'none !important' : 'translateY(54px)')};
  filter: ${({ isEditor }) => (isEditor ? 'none !important' : 'blur(7px)')};
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

const ContentWrapper = styled.div<{
  alignment: 'left' | 'center' | 'right'
  isBanner?: boolean
}>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  position: relative;
  z-index: 2;

  align-items: ${({ alignment }) =>
    alignment === 'center'
      ? 'center'
      : alignment === 'right'
        ? 'flex-end'
        : 'flex-start'};
  text-align: ${({ alignment }) => alignment};

  ${({ isBanner }) =>
    isBanner
      ? `
        max-width: 860px;
        padding: 40px 0;
      `
      : ''}
`

const SplitContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: clamp(32px, 5vw, 64px);
  align-items: center;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

const Display = styled.h1`
  max-width: var(--forge-content-width);
  margin: 0;
  font: 520 clamp(58px, 9.6vw, 146px) / 0.84 var(--forge-heading);
  letter-spacing: -0.078em;
  text-wrap: balance;

  @media (max-width: 767px) {
    font-size: clamp(48px, 15vw, 72px);
    line-height: 0.88;
  }
`

const Intro = styled.p`
  max-width: 620px;
  margin: 14px 0 0 auto;
  color: rgba(var(--color-foreground), 0.72);
  font-size: clamp(17px, 1.7vw, 22px);
  line-height: 1.55;
  letter-spacing: -0.02em;

  @media (max-width: 767px) {
    margin-left: 0;
  }
`

const FallbackButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px 6px 18px;
  border-radius: var(--forge-button-radius);
  border: var(--forge-button-border-width) solid rgb(var(--color-button));
  background: rgb(var(--color-button));
  color: rgb(var(--color-button-text));
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  margin-top: 12px;
  transition:
    transform 600ms var(--forge-ease),
    background 600ms var(--forge-ease);

  span {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 600ms var(--forge-ease);
  }

  &:hover {
    transform: translateY(-2px);
    span {
      transform: translate(3px, -2px) scale(1.06);
    }
  }
`

const HeroMediaShell = styled.div<{ isSplit?: boolean }>`
  margin-top: ${({ isSplit }) => (isSplit ? '0' : 'clamp(58px, 8vw, 112px)')};
  padding: 7px;
  border-radius: 34px;
  background: rgba(23, 25, 21, 0.07);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.05);
  width: 100%;
  box-sizing: border-box;
`

const HeroMedia = styled.div<{
  image: string
  mediaHeight: 'small' | 'medium' | 'large'
  overlayOpacity: number
}>`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background: #353831 url(${({ image }) => image}) center / cover no-repeat;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);

  min-height: ${({ mediaHeight }) => {
    switch (mediaHeight) {
      case 'small':
        return 'clamp(360px, 45vw, 480px)'
      case 'medium':
        return 'clamp(460px, 55vw, 620px)'
      case 'large':
      default:
        return 'min(68vw, 760px)'
    }
  }};

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(10, 12, 10, 0.58),
      transparent 55%
    );
    opacity: ${({ overlayOpacity }) => overlayOpacity / 50};
    content: '';
  }

  @media (max-width: 767px) {
    min-height: 420px;
  }
`

const MediaStamp = styled.div<{
  position: 'bottom-right' | 'bottom-left' | 'top-right'
  colorStyle: 'orange' | 'ink' | 'bone'
}>`
  position: absolute;
  z-index: 2;
  display: grid;
  width: 104px;
  height: 104px;
  place-items: center;
  border-radius: 50%;
  text-align: center;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  white-space: pre-line;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  transition: transform 600ms var(--forge-ease);

  ${({ position }) => {
    switch (position) {
      case 'bottom-left':
        return 'left: 28px; bottom: 26px;'
      case 'top-right':
        return 'right: 28px; top: 26px;'
      case 'bottom-right':
      default:
        return 'right: 28px; bottom: 26px;'
    }
  }}

  ${({ colorStyle }) => {
    switch (colorStyle) {
      case 'ink':
        return 'background: var(--forge-ink); color: var(--forge-paper);'
      case 'bone':
        return 'background: var(--forge-paper); color: var(--forge-ink);'
      case 'orange':
      default:
        return 'background: var(--forge-orange); color: var(--forge-ink);'
    }
  }}

  &:hover {
    transform: rotate(8deg) scale(1.05);
  }

  @media (max-width: 767px) {
    width: 86px;
    height: 86px;
    right: 16px;
    bottom: 16px;
    left: auto;
  }
`

export const CompanyHero: React.FC<
  SectionComponentProps<CompanyHeroSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()

  const {
    layout_style = 'frame',
    text_alignment = 'left',
    banner_height = 'auto',
    media_height = 'large',
    color_scheme,
    dark_mode,
    image = defaultImage,
    overlay_opacity = 40,
    show_media = true,
    show_stamp = true,
    stamp_text = 'Made to\nendure\n↘',
    stamp_position = 'bottom-right',
    stamp_color = 'orange',
    padding_top = 160,
    padding_bottom = 34,
    // Fallback settings
    title = 'Engineered with intent. Built without compromise.',
    intro = 'Precision manufacturing for the systems that keep the world moving.',
    button_label,
    button_link,
  } = settings

  const imageUrl = typeof image === 'string' ? image : image.url || defaultImage

  const hasBlocks = blockOrder.length > 0
  const isBanner = layout_style === 'banner'
  const isSplit = layout_style === 'split'
  const resolvedColorScheme =
    color_scheme || (dark_mode ? 'scheme-2' : 'scheme-1')

  const resolvedMinHeight =
    banner_height === 'screen'
      ? '100dvh'
      : banner_height === 'large'
        ? '800px'
        : banner_height === 'medium'
          ? '640px'
          : banner_height === 'small'
            ? '500px'
            : 'auto'

  const renderContent = () => (
    <ContentWrapper alignment={text_alignment} isBanner={isBanner}>
      {hasBlocks ? (
        blockOrder.map((blockId) => {
          const block = blocks[blockId]
          // if (!block) return null

          return (
            <BlockRenderer
              key={blockId}
              sectionId={id}
              blockId={blockId}
              block={block}
              isEditor={isEditor}
            />
          )
        })
      ) : (
        <>
          {title && <Display>{title}</Display>}
          {intro && <Intro>{intro}</Intro>}
          {button_label && (
            <FallbackButton href={button_link || '#'}>
              {button_label}
              <span aria-hidden="true">↗</span>
            </FallbackButton>
          )}
        </>
      )}
    </ContentWrapper>
  )

  const renderMedia = (splitMode = false) => (
    <HeroMediaShell isSplit={splitMode}>
      <HeroMedia
        image={imageUrl}
        mediaHeight={media_height}
        overlayOpacity={overlay_opacity}
      >
        {show_stamp && stamp_text && (
          <MediaStamp position={stamp_position} colorStyle={stamp_color}>
            {stamp_text.replace(/\\n/g, '\n')}
          </MediaStamp>
        )}
      </HeroMedia>
    </HeroMediaShell>
  )

  return (
    <HeroContainer
      className={`color-${resolvedColorScheme}`}
      data-color-scheme={resolvedColorScheme}
      style={isBanner ? { backgroundImage: `url("${imageUrl}")` } : undefined}
      ref={rootRef}
      paddingTop={padding_top}
      paddingBottom={padding_bottom}
      minHeight={resolvedMinHeight}
      isBanner={isBanner}
      bgImage={imageUrl}
    >
      {isBanner && <BannerOverlay opacity={overlay_opacity} />}

      {isSplit ? (
        <SplitContainer>
          <Reveal data-reveal isEditor={isEditor}>
            {renderContent()}
          </Reveal>
          {show_media && (
            <Reveal data-reveal isEditor={isEditor}>
              {renderMedia(true)}
            </Reveal>
          )}
        </SplitContainer>
      ) : (
        <>
          <Reveal data-reveal isEditor={isEditor}>
            {renderContent()}
          </Reveal>
          {!isBanner && show_media && (
            <Reveal data-reveal isEditor={isEditor}>
              {renderMedia(false)}
            </Reveal>
          )}
        </>
      )}
    </HeroContainer>
  )
}
