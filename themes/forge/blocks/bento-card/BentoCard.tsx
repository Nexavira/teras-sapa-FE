import React from 'react'

import styled from '@emotion/styled'

import type {
  BlockComponentProps,
  ImageValue,
} from '#themes/shared/types/theme'

export interface BentoCardSettings {
  tag?: string
  title?: string
  description?: string
  image?: string | ImageValue
  link_label?: string
  link_url?: string
  dark?: boolean
  span?: string | number
}

const Shell = styled.div<{ span: number }>`
  grid-column: span ${({ span }) => span};
  padding: 6px;
  border-radius: var(--forge-card-radius);
  background: rgba(23, 25, 21, 0.055);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.045);
  box-sizing: border-box;

  @media (max-width: 767px) {
    grid-column: 1 / -1;
  }
`

const Card = styled.article<{ dark?: boolean }>`
  min-height: 340px;
  height: 100%;
  padding: 30px;
  border-radius: var(--forge-media-radius);
  background: ${({ dark }) => (dark ? 'var(--forge-ink)' : 'var(--forge-paper)')};
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'var(--forge-ink)')};
  box-shadow: inset 0 1px 0
    ${({ dark }) =>
      dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.8)'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: transform 750ms var(--forge-ease);

  &:hover {
    transform: translateY(-5px);
  }

  small {
    display: block;
    color: ${({ dark }) => (dark ? 'var(--forge-orange)' : '#75786f')};
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  h3 {
    max-width: 520px;
    margin: 32px 0 14px;
    font: 540 clamp(30px, 3.8vw, 54px) / 0.96 var(--forge-heading);
    letter-spacing: -0.055em;
  }

  p {
    max-width: 480px;
    margin: 0;
    color: ${({ dark }) => (dark ? 'rgba(244, 241, 233, 0.55)' : '#686b64')};
    font-size: 13px;
    line-height: 1.5;
  }
`

const ImageWrapper = styled.div<{ image: string }>`
  min-height: 280px;
  border-radius: 20px;
  margin-bottom: 24px;
  background: #3c3f38 url(${({ image }) => image}) center / cover;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);

  @media (max-width: 767px) {
    min-height: 220px;
  }
`

const ArrowLink = styled.a<{ dark?: boolean }>`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 13px;
  margin-top: 24px;
  padding: 6px 7px 6px 18px;
  border-radius: var(--forge-button-radius);
  background: ${({ dark }) =>
    dark ? 'rgba(255, 255, 255, 0.1)' : 'var(--forge-ink)'};
  color: var(--forge-paper);
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

export const BentoCard: React.FC<BlockComponentProps<BentoCardSettings>> = ({
  children,
  settings,
  ...restProps
}) => {
  const {
    tag,
    title,
    description,
    image,
    link_label,
    link_url,
    dark = false,
    span = '4',
  } = settings

  const imageUrl = typeof image === 'string' ? image : image?.url
  const columnSpan = Number(span) || 4

  const hasChildren = React.Children.count(children) > 0

  return (
    <Shell span={columnSpan} {...restProps}>
      <Card dark={dark}>
        {hasChildren ? (
          children
        ) : (
          <>
            <div>
              {imageUrl && <ImageWrapper image={imageUrl} />}
              {tag && <small>{tag}</small>}
            </div>
            <div>
              {title && <h3>{title}</h3>}
              {description && <p>{description}</p>}
              {link_label && link_url && (
                <ArrowLink dark={dark} href={link_url}>
                  {link_label} <span>↗</span>
                </ArrowLink>
              )}
            </div>
          </>
        )}
      </Card>
    </Shell>
  )
}
