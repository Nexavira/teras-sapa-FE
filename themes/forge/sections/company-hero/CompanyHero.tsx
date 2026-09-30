import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/forge/blocks/BlockRenderer'
import { Reveal } from '#themes/forge/snippets/Reveal'
import { useReveal } from '#themes/forge/snippets/useReveal'
import type {
  ImageValue,
  SectionComponentProps,
} from '#themes/shared/types/theme'

export interface CompanyHeroSettings {
  layout_style?: 'frame' | 'banner' | 'split'
  text_alignment?: 'left' | 'center' | 'right'
  banner_height?: 'auto' | 'small' | 'medium' | 'large' | 'screen'
  color_scheme?: string
  /** Legacy templates are mapped to scheme-1 or scheme-2. */
  dark_mode?: boolean
  image?: string | ImageValue
  overlay_opacity?: number
  padding_top?: number
  padding_bottom?: number
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

  > [data-block-type='image'],
  > [data-block-type='hero_image'],
  > [data-editor-surface][data-block-type='image'],
  > [data-editor-surface][data-block-type='hero_image'] {
    width: 100%;
    margin-top: clamp(40px, 6vw, 80px);
  }

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

  [data-hero-media-shell] {
    margin-top: 0;
  }

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`

const isImageBlockType = (type?: string) =>
  type === 'image' || type === 'hero_image'

export const CompanyHero: React.FC<
  SectionComponentProps<CompanyHeroSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const rootRef = useReveal()

  const {
    layout_style = 'frame',
    text_alignment = 'left',
    banner_height = 'auto',
    color_scheme,
    dark_mode,
    image = defaultImage,
    overlay_opacity = 40,
    padding_top = 160,
    padding_bottom = 34,
  } = settings

  const imageUrl = typeof image === 'string' ? image : image.url || defaultImage

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

  const renderBlock = (blockId: string) => {
    const block = blocks[blockId]
    if (!block.type) return null

    return (
      <BlockRenderer
        key={blockId}
        sectionId={id}
        blockId={blockId}
        block={block}
        isEditor={isEditor}
      />
    )
  }

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
          <Reveal isEditor={isEditor}>
            <ContentWrapper alignment={text_alignment}>
              {blockOrder
                .filter((blockId) => !isImageBlockType(blocks[blockId].type))
                .map(renderBlock)}
            </ContentWrapper>
          </Reveal>
          <Reveal isEditor={isEditor}>
            <div>
              {blockOrder
                .filter((blockId) => isImageBlockType(blocks[blockId].type))
                .map(renderBlock)}
            </div>
          </Reveal>
        </SplitContainer>
      ) : (
        <Reveal isEditor={isEditor}>
          <ContentWrapper alignment={text_alignment} isBanner={isBanner}>
            {blockOrder.map(renderBlock)}
          </ContentWrapper>
        </Reveal>
      )}
    </HeroContainer>
  )
}
