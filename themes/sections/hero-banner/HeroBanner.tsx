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
}

const BannerContainer = styled.section<{
  height: string
  alignment: string
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
  background: var(--gradient-background, rgb(var(--color-background)));
  padding: 64px 24px;
`

const BackgroundGraphic = styled.div<{ opacity?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${({ opacity }) => (typeof opacity === 'number' ? opacity / 100 : 0.15)};
  background-image:
    radial-gradient(
      circle at 20% 40%,
      rgba(var(--color-button), 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 60%,
      rgba(var(--color-secondary-button), 0.3) 0%,
      transparent 50%
    );
  pointer-events: none;
`

const ContentBox = styled.div<{ alignment: string }>`
  position: relative;
  z-index: 10;
  max-width: 720px;
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
  } = settings

  const hasBlocks = blockOrder.length > 0

  return (
    <BannerContainer
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      height={banner_height}
      alignment={text_alignment}
    >
      <BackgroundGraphic opacity={overlay_opacity} />
      <ContentBox alignment={text_alignment}>
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
