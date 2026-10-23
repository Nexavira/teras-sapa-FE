import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface HeadingBlockSettings {
  heading?: string
  heading_size?: 'display' | 'large' | 'medium' | 'small'
  heading_tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'span'
  text_align?: 'left' | 'center' | 'right'
}

const StyledHeading = styled.h1<{
  size: 'display' | 'large' | 'medium' | 'small'
  align: 'left' | 'center' | 'right'
}>`
  margin: 0;
  text-wrap: balance;
  text-align: ${({ align }) => align};
  color: inherit;
  font-family: var(--forge-heading);
  font-weight: var(--forge-heading-weight, 520);
  letter-spacing: var(--forge-heading-letter-spacing, -0.05em);
  text-transform: var(--forge-heading-text-transform, none);

  ${({ size }) => {
    switch (size) {
      case 'display':
        return `
          font-size: calc(clamp(58px, 9.6vw, 146px) * var(--forge-heading-scale, 1));
          line-height: 0.84;
          @media (max-width: 767px) {
            font-size: calc(clamp(48px, 15vw, 72px) * var(--forge-heading-scale, 1));
            line-height: 0.88;
          }
        `
      case 'large':
        return `
          font-size: calc(clamp(42px, 6.1vw, 88px) * var(--forge-heading-scale, 1));
          line-height: 0.93;
          @media (max-width: 767px) {
            font-size: calc(clamp(34px, 8vw, 48px) * var(--forge-heading-scale, 1));
          }
        `
      case 'medium':
        return `
          font-size: calc(clamp(28px, 3.8vw, 54px) * var(--forge-heading-scale, 1));
          line-height: 1.05;
        `
      case 'small':
      default:
        return `
          font-size: calc(clamp(22px, 2.5vw, 34px) * var(--forge-heading-scale, 1));
          line-height: 1.15;
        `
    }
  }}
`

export const HeadingBlock: React.FC<
  BlockComponentProps<HeadingBlockSettings>
> = ({ settings, ...restProps }) => {
  const {
    heading = 'Engineered with intent. Built without compromise.',
    heading_size = 'display',
    heading_tag = 'h1',
    text_align = 'left',
  } = settings

  if (!heading) return null

  return (
    <StyledHeading
      as={heading_tag}
      size={heading_size}
      align={text_align}
      {...restProps}
    >
      {heading}
    </StyledHeading>
  )
}
