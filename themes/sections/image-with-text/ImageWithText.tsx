import React from 'react'

import styled from '@emotion/styled'
import { ArrowUpRight01Icon } from 'hugeicons-react'

import type { SectionComponentProps } from '#themes/types/theme'

export interface ImageWithTextSettings {
  image?: string
  image_position?: 'left' | 'right'
  eyebrow?: string
  heading?: string
  text?: string
  button_label?: string
  button_link?: string
  color_scheme?: string
  padding_top?: number
  padding_bottom?: number
}

const Section = styled.section<{ paddingTop: number; paddingBottom: number }>`
  padding: ${({ paddingTop, paddingBottom }) => `${paddingTop}px 0 ${paddingBottom}px`};
  color: rgb(var(--color-foreground));
  background: var(--gradient-background, rgb(var(--color-background)));
`

const Inner = styled.div<{ imagePosition: 'left' | 'right' }>`
  width: min(
    calc(100% - (2 * var(--gutter-desktop, 32px))),
    var(--page-width, 1280px)
  );
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  align-items: stretch;

  ${({ imagePosition }) =>
    imagePosition === 'right'
      ? `
        & > div:first-of-type { order: 2; }
        & > div:last-of-type { order: 1; }
      `
      : ''}

  @media (max-width: 820px) {
    width: calc(100% - (2 * var(--gutter-mobile, 16px)));
    grid-template-columns: 1fr;

    & > div:first-of-type,
    & > div:last-of-type {
      order: initial;
    }
  }
`

const Media = styled.div<{ image?: string }>`
  min-height: 580px;
  background-color: #e9e2d7;
  background-image: ${({ image }) => (image ? `url("${image}")` : 'none')};
  background-position: 68% center;
  background-size: cover;

  @media (max-width: 820px) {
    min-height: min(115vw, 560px);
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(48px, 7vw, 96px);
  background: rgb(var(--color-background));
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

export const ImageWithText: React.FC<
  SectionComponentProps<ImageWithTextSettings>
> = ({ settings }) => {
  const {
    image = '/images/dawn/hero-editorial.webp',
    image_position = 'left',
    eyebrow = 'Considered by design',
    heading = 'Fewer things. Better made.',
    text = 'Natural materials, enduring shapes, and thoughtful details. We make everyday pieces to keep, wear, and live with for years.',
    button_label = 'Our approach',
    button_link = '/pages/about',
    color_scheme = 'scheme-2',
    padding_top = 88,
    padding_bottom = 88,
  } = settings

  return (
    <Section
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      paddingBottom={padding_bottom}
      paddingTop={padding_top}
    >
      <Inner imagePosition={image_position}>
        <Media
          image={image}
          role="img"
          aria-label="Natural everyday essentials"
        />
        <Content>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {heading && <Heading>{heading}</Heading>}
          {text && <Body>{text}</Body>}
          {button_label && (
            <Link href={button_link}>
              {button_label}
              <ArrowUpRight01Icon aria-hidden="true" size={17} />
            </Link>
          )}
        </Content>
      </Inner>
    </Section>
  )
}
