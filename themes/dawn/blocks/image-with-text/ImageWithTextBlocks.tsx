import React from 'react'

import styled from '@emotion/styled'
import { ArrowUpRight01Icon } from 'hugeicons-react'

import type { BlockComponentProps } from '#themes/shared/types/theme'

const Media = styled.div<{ image?: string }>`
  min-height: 580px;
  height: 100%;
  background-color: #e9e2d7;
  background-image: ${({ image }) => (image ? `url("${image}")` : 'none')};
  background-position: 68% center;
  background-size: cover;

  @media (max-width: 820px) {
    min-height: min(115vw, 560px);
  }
`

const Eyebrow = styled.p`
  margin: 0 0 20px;
  color: rgba(var(--color-foreground), 0.62);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const Heading = styled.h2`
  max-width: 500px;
  margin: 0;
  font-family: var(--font-heading, serif);
  font-size: clamp(2.25rem, 4vw, 4.25rem);
  font-weight: var(--font-heading-weight, 500);
  letter-spacing: -0.045em;
  line-height: 1.04;
`

const Body = styled.p`
  max-width: 480px;
  margin: 28px 0 0;
  color: rgba(var(--color-foreground), 0.7);
  font-size: 15px;
  line-height: 1.8;
`

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 34px;
  padding-bottom: 5px;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;

  svg {
    transition: transform 180ms ease;
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }
`

export const EditorialImageBlock: React.FC<BlockComponentProps> = ({
  settings,
  ...restProps
}) => (
  <Media
    image={settings.image}
    role="img"
    aria-label={settings.alt || 'Natural everyday essentials'}
    {...restProps}
  />
)
export const EditorialEyebrowBlock: React.FC<BlockComponentProps> = ({
  settings,
  ...restProps
}) =>
  settings.eyebrow ? <Eyebrow {...restProps}>{settings.eyebrow}</Eyebrow> : null

export const EditorialHeadingBlock: React.FC<BlockComponentProps> = ({
  settings,
  ...restProps
}) =>
  settings.heading ? <Heading {...restProps}>{settings.heading}</Heading> : null

export const EditorialTextBlock: React.FC<BlockComponentProps> = ({
  settings,
  ...restProps
}) => (settings.text ? <Body {...restProps}>{settings.text}</Body> : null)

export const EditorialLinkBlock: React.FC<BlockComponentProps> = ({
  settings,
  ...restProps
}) =>
  settings.button_label ? (
    <Link href={settings.button_link} {...restProps}>
      {settings.button_label}
      <ArrowUpRight01Icon aria-hidden="true" size={17} />
    </Link>
  ) : null
