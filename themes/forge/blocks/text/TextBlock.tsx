import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface TextBlockSettings {
  text?: string
  text_style?: 'intro' | 'body' | 'caption'
  text_align?: 'left' | 'center' | 'right'
  max_width?: number
  width?: '1' | '2' | '3' | string
}

const StyledParagraph = styled.p<{
  textStyle: 'intro' | 'body' | 'caption'
  align: 'left' | 'center' | 'right'
  maxWidth?: number
  gridWidth?: string
}>`
  margin: 0;
  text-align: ${({ align }) => align};
  max-width: ${({ maxWidth, gridWidth }) => {
    if (
      gridWidth === 'full' ||
      (Number(gridWidth) >= 3 && !isNaN(Number(gridWidth)))
    )
      return '100%'
    if (gridWidth === '2') return '800px'
    return maxWidth ? `${maxWidth}px` : '620px'
  }};
  width: 100%;
  box-sizing: border-box;

  ${({ gridWidth }) => {
    if (gridWidth === 'full') {
      return 'grid-column: 1 / -1;'
    }
    const num = Number(gridWidth)
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return `grid-column: span ${num};`
    }
    return 'grid-column: span 1;'
  }}

  @media (max-width: 767px) {
    grid-column: span 1 !important;
  }

  font-family: var(--forge-body);
  font-weight: var(--forge-body-weight, 400);

  ${({ align }) => {
    if (align === 'center') return 'margin-left: auto; margin-right: auto;'
    if (align === 'right') return 'margin-left: auto;'
    return ''
  }}

  ${({ textStyle }) => {
    switch (textStyle) {
      case 'intro':
        return `
          color: rgba(var(--color-foreground), 0.72);
          font-size: calc(var(--forge-body-size, 15px) * 1.25);
          line-height: var(--forge-body-line-height, 1.55);
          letter-spacing: -0.02em;
        `
      case 'caption':
        return `
          color: rgba(var(--color-foreground), 0.62);
          font-size: calc(var(--forge-body-size, 15px) * 0.85);
          line-height: var(--forge-body-line-height, 1.5);
          letter-spacing: 0.02em;
        `
      case 'body':
      default:
        return `
          color: rgba(var(--color-foreground), 0.82);
          font-size: var(--forge-body-size, 15px);
          line-height: var(--forge-body-line-height, 1.65);
        `
    }
  }}
`

export const TextBlock: React.FC<BlockComponentProps<TextBlockSettings>> = ({
  settings,
  ...restProps
}) => {
  const {
    text = 'Precision manufacturing for the systems that keep the world moving.',
    text_style = 'intro',
    text_align = 'left',
    max_width = 620,
    width = '1',
  } = settings

  if (!text) return null

  return (
    <StyledParagraph
      align={text_align}
      gridWidth={width}
      maxWidth={max_width}
      textStyle={text_style}
      {...restProps}
    >
      {text}
    </StyledParagraph>
  )
}
