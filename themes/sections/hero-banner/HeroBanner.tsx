import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/blocks/BlockRenderer'
import type { SectionComponentProps } from '#themes/types/theme'

export interface HeroBannerSettings {
  heading?: string
  subheading?: string
  button_text?: string
  button_link?: string
  text_alignment?: 'left' | 'center' | 'right'
  banner_height?: 'small' | 'medium' | 'large'
  color_scheme?: string
  overlay_opacity?: number
  background_image?: string
  content_position?: 'left' | 'center' | 'right'
  show_content_box?: boolean
}

const BannerContainer = styled.section<{
  height: string
  alignment: string
  backgroundImage?: string
}>`
  width: 100%;
  min-height: ${({ height }) =>
    height === 'small' ? '360px' : height === 'large' ? '600px' : '480px'};
  display: flex;
  align-items: center;
  justify-content: ${({ alignment }) =>
    alignment === 'left'
      ? 'flex-start'
      : alignment === 'right'
        ? 'flex-end'
        : 'center'};
  position: relative;
  overflow: hidden;
  color: rgb(var(--color-foreground));
  background-color: rgb(var(--color-background));
  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url("${backgroundImage}")` : 'none'} !important;
  background-position: center;
  background-size: cover;
  padding: 72px
    max(
      var(--gutter-desktop, 32px),
      calc((100vw - var(--page-width, 1280px)) / 2)
    );

  @media (max-width: 768px) {
    min-height: ${({ height }) =>
      height === 'small' ? '420px' : height === 'large' ? '620px' : '520px'};
    align-items: flex-end;
    background-position: 68% center;
    padding: 40px var(--gutter-mobile, 16px);
  }
`

const BackgroundGraphic = styled.div<{ opacity?: number; hasImage: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ hasImage }) =>
    hasImage
      ? 'linear-gradient(90deg, rgba(24, 22, 18, 0.42) 0%, rgba(24, 22, 18, 0.12) 52%, rgba(24, 22, 18, 0.04) 100%)'
      : 'radial-gradient(circle at 20% 40%, rgba(var(--color-button), 0.18) 0%, transparent 55%)'};
  opacity: ${({ opacity }) =>
    typeof opacity === 'number' ? opacity / 100 : 0.2};
  pointer-events: none;
`

const ContentBox = styled.div<{
  alignment: string
  showBox: boolean
  hasImage: boolean
}>`
  position: relative;
  z-index: 10;
  max-width: 620px;
  width: 100%;
  text-align: ${({ alignment }) => alignment};
  display: flex;
  flex-direction: column;
  align-items: ${({ alignment }) =>
    alignment === 'left'
      ? 'flex-start'
      : alignment === 'right'
        ? 'flex-end'
        : 'center'};
  gap: 16px;
  padding: ${({ showBox }) => (showBox ? '38px 42px' : '0')};
  color: ${({ hasImage }) => (hasImage ? '#ffffff' : 'inherit')};
  background: ${({ showBox }) =>
    showBox ? 'rgba(var(--color-background), 0.94)' : 'transparent'};
  backdrop-filter: ${({ showBox }) => (showBox ? 'blur(8px)' : 'none')};

  ${({ showBox }) =>
    showBox
      ? `
        color: rgb(var(--color-foreground));
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.08);
      `
      : ''}

  @media (max-width: 768px) {
    max-width: 520px;
    padding: ${({ showBox }) => (showBox ? '28px 24px' : '0')};
  }
`

const Heading = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin: 0;
  color: rgb(var(--color-foreground));

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const Subheading = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(var(--color-foreground), 0.85);
  margin: 0;
  max-width: 600px;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  margin-top: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgb(var(--color-button-text));
  background-color: rgb(var(--color-button));
  border: 1px solid rgb(var(--color-button));
  border-radius: var(--button-radius, 8px);
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(var(--color-shadow), 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--color-shadow), 0.25);
    opacity: 0.92;
  }
`

export const HeroBanner: React.FC<
  SectionComponentProps<HeroBannerSettings>
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const {
    heading = 'Elevate Your Everyday Style',
    subheading = 'Discover the latest seasonal collection crafted with sustainable materials and timeless silhouettes.',
    button_text = 'Shop Collection',
    button_link = '/collections/all',
    text_alignment = 'center',
    banner_height = 'medium',
    color_scheme = 'scheme-3',
    overlay_opacity = 40,
    background_image,
    content_position,
    show_content_box = false,
  } = settings

  const hasBlocks = blockOrder.length > 0
  const resolvedPosition = content_position || text_alignment
  const hasImage = Boolean(background_image)

  return (
    <BannerContainer
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      height={banner_height}
      alignment={resolvedPosition}
      backgroundImage={background_image}
    >
      <BackgroundGraphic opacity={overlay_opacity} hasImage={hasImage} />
      <ContentBox
        alignment={text_alignment}
        hasImage={hasImage}
        showBox={show_content_box}
      >
        {hasBlocks ? (
          blockOrder.map((blockId) => {
            const block = blocks[blockId]

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
            {heading && <Heading>{heading}</Heading>}
            {subheading && <Subheading>{subheading}</Subheading>}
            {button_text && (
              <CTAButton href={button_link}>{button_text}</CTAButton>
            )}
          </>
        )}
      </ContentBox>
    </BannerContainer>
  )
}
