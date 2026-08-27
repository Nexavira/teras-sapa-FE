import type {
  CSSProperties,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from 'react'
import { useEffect, useMemo, useState } from 'react'

import styled from '@emotion/styled'
import { ImageNotFound01Icon, Pdf01Icon } from 'hugeicons-react'

export type ImageContainerSource = string | { src: string }

export interface ImageContainerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  src: ImageContainerSource
  alt: string
  children?: ReactNode
  disabledOpenPdf?: boolean
  fallbackSrc?: string
  imageLoading?: ImgHTMLAttributes<HTMLImageElement>['loading']
  objectFit?: CSSProperties['objectFit']
}

const Root = styled.div`
  position: relative;
  overflow: hidden;
  background: #f3f4f6;

  &[data-loading='true']::after {
    position: absolute;
    z-index: 2;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 20%,
      rgba(255, 255, 255, 0.72) 42%,
      transparent 64%
    );
    content: '';
    transform: translateX(-100%);
    animation: image-container-wave 1.35s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes image-container-wave {
    to {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-loading='true']::after {
      animation: none;
    }
  }
`

const Image = styled.img<{ $objectFit: CSSProperties['objectFit'] }>`
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ $objectFit }) => $objectFit};
  object-position: center;
`

const FileButton = styled.button`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: inherit;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #374151;
  }

  &:disabled {
    cursor: default;
    opacity: 0.55;
  }
`

const UnavailableState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #9ca3af;
  text-align: center;

  span {
    font-size: 0.75rem;
    font-weight: 600;
  }
`

function resolveSource(source: ImageContainerSource): string {
  return typeof source === 'string' ? source : source.src
}

function isPdfSource(source: string): boolean {
  return /\.pdf(?:$|[?#])/i.test(source)
}

export const ImageContainer = ({
  src,
  alt,
  children,
  disabledOpenPdf = false,
  fallbackSrc = '/imgs/no_picture.svg',
  imageLoading = 'lazy',
  objectFit = 'cover',
  ...props
}: ImageContainerProps) => {
  const source = useMemo(() => resolveSource(src), [src])
  const isPdf = isPdfSource(source)
  const [imageSource, setImageSource] = useState(source || fallbackSrc)
  const [loading, setLoading] = useState(!isPdf)
  const [fallbackFailed, setFallbackFailed] = useState(false)

  useEffect(() => {
    setImageSource(source || fallbackSrc)
    setLoading(!isPdf)
    setFallbackFailed(false)
  }, [fallbackSrc, isPdf, source])

  const handlePdfClick = () => {
    if (disabledOpenPdf || !source) return
    window.open(source, '_blank', 'noopener,noreferrer')
  }

  const handleImageError = () => {
    if (imageSource !== fallbackSrc) {
      setImageSource(fallbackSrc)
      return
    }

    setFallbackFailed(true)
    setLoading(false)
  }

  return (
    <Root {...props} data-loading={loading}>
      {isPdf ? (
        <FileButton
          type="button"
          onClick={handlePdfClick}
          title={alt}
          aria-label={alt || 'Buka dokumen PDF'}
          disabled={disabledOpenPdf || !source}
        >
          <Pdf01Icon size="34%" aria-hidden="true" />
        </FileButton>
      ) : fallbackFailed ? (
        <UnavailableState role="img" aria-label={alt}>
          <ImageNotFound01Icon size={32} aria-hidden="true" />
          <span>Gambar tidak tersedia</span>
        </UnavailableState>
      ) : (
        <Image
          src={imageSource}
          alt={alt}
          loading={imageLoading}
          decoding="async"
          $objectFit={objectFit}
          onError={handleImageError}
          onLoad={() => setLoading(false)}
        />
      )}
      {children}
    </Root>
  )
}
