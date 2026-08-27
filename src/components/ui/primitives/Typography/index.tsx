import type { ElementType, ReactNode } from 'react'
import * as React from 'react'

import styled from '@emotion/styled'

export interface TypographyProps {
  as?: ElementType
  variant?: 'display' | 'title' | 'body' | 'caption'
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'inherit'
  weight?: 'regular' | 'medium' | 'bold'
  children: ReactNode
  className?: string
}

const StyledTypography = styled.span<TypographyProps>`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};

  font-size: ${({ theme, variant }) => {
    switch (variant) {
      case 'display':
        return theme.typography.sizes.display
      case 'title':
        return theme.typography.sizes.title
      case 'caption':
        return theme.typography.sizes.caption
      case 'body':
      default:
        return theme.typography.sizes.body
    }
  }};

  font-weight: ${({ theme, weight }) => {
    switch (weight) {
      case 'bold':
        return theme.typography.weights.bold
      case 'medium':
        return theme.typography.weights.medium
      case 'regular':
      default:
        return theme.typography.weights.regular
    }
  }};

  color: ${({ theme, color }) => {
    switch (color) {
      case 'primary':
        return theme.colors.text.primary
      case 'secondary':
        return theme.colors.text.secondary
      case 'muted':
        return theme.colors.muted // wait, text muted is secondary? let's use text.secondary for muted
      case 'inverse':
        return theme.colors.text.inverse
      case 'inherit':
        return 'inherit'
      default:
        return theme.colors.text.primary
    }
  }};

  line-height: ${({ theme, variant }) =>
    variant === 'display' || variant === 'title'
      ? theme.typography.lineHeights.tight
      : theme.typography.lineHeights.normal};
`

export const Typography = ({
  as = 'span',
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  children,
  ...props
}: TypographyProps) => {
  return (
    <StyledTypography
      as={as}
      variant={variant}
      color={color}
      weight={weight}
      {...props}
    >
      {children}
    </StyledTypography>
  )
}
