import type { HTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'

export type BadgeVariant =
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  children: ReactNode
}

const StyledBadge = styled.span<{
  $variant: BadgeVariant
  $size: 'sm' | 'md'
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.weights.medium};
  border-radius: ${theme.radius.full};
  white-space: nowrap;
  transition: all 0.2s ease;

  /* Sizes */
  ${({ $size }) =>
    $size === 'sm'
      ? `
        font-size: 0.7rem;
        padding: 2px 7px;
      `
      : `
        font-size: 0.775rem;
        padding: 3px 10px;
      `}

  /* Variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: #FFF0F1;
          color: ${theme.colors.primary.DEFAULT};
          border: 1px solid #FFD1D4;
        `
      case 'success':
        return `
          background-color: #E6F7F5;
          color: #007A70;
          border: 1px solid #B8EBE6;
        `
      case 'warning':
        return `
          background-color: #FFF8E6;
          color: #92400E;
          border: 1px solid #FEE685;
        `
      case 'danger':
        return `
          background-color: #FEE2E2;
          color: #B91C1C;
          border: 1px solid #FECACA;
        `
      case 'info':
        return `
          background-color: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        `
      case 'neutral':
      case 'default':
      default:
        return `
          background-color: ${theme.colors.muted};
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.border};
        `
    }
  }}
`

const BadgeDot = styled.span<{ $variant: BadgeVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;

  background-color: ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return theme.colors.primary.DEFAULT
      case 'success':
        return '#008A05'
      case 'warning':
        return '#F59E0B'
      case 'danger':
        return theme.colors.error
      case 'info':
        return '#3B82F6'
      case 'neutral':
      case 'default':
      default:
        return theme.colors.text.secondary
    }
  }};
`

export const Badge = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) => {
  return (
    <StyledBadge $variant={variant} $size={size} {...props}>
      {dot && <BadgeDot $variant={variant} />}
      {children}
    </StyledBadge>
  )
}
