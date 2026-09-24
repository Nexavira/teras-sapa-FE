import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface TextBlockSettings {
  text?: string
  text_style?: 'intro' | 'body' | 'caption'
  text_align?: 'left' | 'center' | 'right'
  max_width?: number
}

const StyledParagraph = styled.p<{
  textStyle: 'intro' | 'body' | 'caption'
  align: 'left' | 'center' | 'right'
  maxWidth?: number
}>`
  margin: 0;
  text-align: ${({ align }) => align};
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '620px')};

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
          font-size: clamp(17px, 1.7vw, 22px);
          line-height: 1.55;
          letter-spacing: -0.02em;
        `
      case 'caption':
        return `
          color: rgba(var(--color-foreground), 0.62);
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0.02em;
        `
      case 'body':
      default:
        return `
          color: rgba(var(--color-foreground), 0.82);
          font-size: 15px;
          line-height: 1.65;
        `
    }
  }}
`

export const TextBlock: React.FC<BlockComponentProps<TextBlockSettings>> = ({
  settings,
}) => {
  const {
    text = 'Precision manufacturing for the systems that keep the world moving.',
    text_style = 'intro',
    text_align = 'left',
    max_width = 620,
  } = settings

  if (!text) return null

  return (
    <StyledParagraph
      textStyle={text_style}
      align={text_align}
      maxWidth={max_width}
    >
      {text}
    </StyledParagraph>
  )
}
