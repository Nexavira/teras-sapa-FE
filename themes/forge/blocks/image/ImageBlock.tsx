import React from 'react'

import styled from '@emotion/styled'

import type {
  BlockComponentProps,
  ImageValue,
} from '#themes/shared/types/theme'

export interface ImageBlockSettings {
  image?: string | ImageValue
  media_height?: 'small' | 'medium' | 'large'
  overlay_opacity?: number
  show_stamp?: boolean
  stamp_text?: string
  stamp_position?: 'bottom-right' | 'bottom-left' | 'top-right'
  stamp_color?: 'orange' | 'ink' | 'bone'
}

const defaultImage =
  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88'

const MediaShell = styled.div`
  padding: 7px;
  border-radius: 34px;
  background: rgba(23, 25, 21, 0.07);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.05);
  width: 100%;
  box-sizing: border-box;
`

const MediaFrame = styled.div<{
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

export const ImageBlock: React.FC<BlockComponentProps<ImageBlockSettings>> = ({
  settings,
  isEditor,
  ...restProps
}) => {
  const {
    image = defaultImage,
    media_height = 'large',
    overlay_opacity = 40,
    show_stamp = true,
    stamp_text = 'Made to\nendure\n↘',
    stamp_position = 'bottom-right',
    stamp_color = 'orange',
  } = settings

  const imageUrl = typeof image === 'string' ? image : image.url || defaultImage

  return (
    <MediaShell data-hero-media-shell {...restProps}>
      <MediaFrame
        image={imageUrl}
        mediaHeight={media_height}
        overlayOpacity={overlay_opacity}
      >
        {show_stamp && stamp_text && (
          <MediaStamp position={stamp_position} colorStyle={stamp_color}>
            {stamp_text.replace(/\\n/g, '\n')}
          </MediaStamp>
        )}
      </MediaFrame>
    </MediaShell>
  )
}
