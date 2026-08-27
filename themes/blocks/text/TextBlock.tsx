import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/types/theme'

export interface TextBlockSettings {
  text?: string
  text_style?: 'body' | 'subheading'
}

const StyledParagraph = styled.p<{ isSubheading: boolean }>`
  margin: 0;
  line-height: 1.6;
  color: ${({ isSubheading }) => (isSubheading ? '#cbd5e1' : 'inherit')};
  font-size: ${({ isSubheading }) => (isSubheading ? '1.125rem' : '0.9375rem')};
  max-width: 640px;

  @media (max-width: 768px) {
    font-size: ${({ isSubheading }) => (isSubheading ? '0.95rem' : '0.875rem')};
  }
`

export const TextBlock: React.FC<BlockComponentProps<TextBlockSettings>> = ({
  settings,
}) => {
  const {
    text = 'Discover the latest seasonal collection crafted with sustainable materials and timeless silhouettes.',
    text_style = 'subheading',
  } = settings

  return (
    <StyledParagraph isSubheading={text_style === 'subheading'}>
      {text}
    </StyledParagraph>
  )
}
