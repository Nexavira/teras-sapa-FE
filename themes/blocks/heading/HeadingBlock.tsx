import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/types/theme'

export interface HeadingBlockSettings {
  heading?: string
  heading_size?: 'small' | 'medium' | 'large'
  heading_tag?: 'h1' | 'h2' | 'h3'
}

const StyledHeading = styled.h2<{ size: string }>`
  margin: 0;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: inherit;

  font-size: ${({ size }) =>
    size === 'small' ? '1.5rem' : size === 'medium' ? '2.25rem' : '2.75rem'};

  @media (max-width: 768px) {
    font-size: ${({ size }) =>
      size === 'small' ? '1.25rem' : size === 'medium' ? '1.75rem' : '2rem'};
  }
`

export const HeadingBlock: React.FC<
  BlockComponentProps<HeadingBlockSettings>
> = ({ settings }) => {
  const {
    heading = 'Elevate Your Everyday Style',
    heading_size = 'large',
    heading_tag = 'h2',
  } = settings

  return (
    <StyledHeading as={heading_tag} size={heading_size}>
      {heading}
    </StyledHeading>
  )
}
