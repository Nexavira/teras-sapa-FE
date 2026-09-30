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

  ${({ size }) => {
    switch (size) {
      case 'display':
        return `
          font: 520 clamp(58px, 9.6vw, 146px) / 0.84 var(--forge-heading);
          letter-spacing: -0.078em;
          @media (max-width: 767px) {
            font-size: clamp(48px, 15vw, 72px);
            line-height: 0.88;
          }
        `
      case 'large':
        return `
          font: 520 clamp(42px, 6.1vw, 88px) / 0.93 var(--forge-heading);
          letter-spacing: -0.065em;
          @media (max-width: 767px) {
            font-size: clamp(34px, 8vw, 48px);
          }
        `
      case 'medium':
        return `
          font: 520 clamp(28px, 3.8vw, 54px) / 1.05 var(--forge-heading);
          letter-spacing: -0.04em;
        `
      case 'small':
      default:
        return `
          font: 520 clamp(22px, 2.5vw, 34px) / 1.15 var(--forge-heading);
          letter-spacing: -0.02em;
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
