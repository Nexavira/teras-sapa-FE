import type { HTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'

export type CardVariant = 'default' | 'outlined' | 'flat' | 'interactive'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  children: ReactNode
}

const StyledCard = styled.div<{
  $variant: CardVariant
  $padding: CardPadding
}>`
  background-color: ${theme.colors.background};
  border-radius: 12px;
  font-family: ${theme.typography.fontFamily};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  /* Padding */
  ${({ $padding }) => {
    switch ($padding) {
      case 'none':
        return 'padding: 0;'
      case 'sm':
        return `padding: ${theme.spacing.sm};`
      case 'lg':
        return `padding: ${theme.spacing.xl};`
      case 'md':
      default:
        return `padding: ${theme.spacing.md};`
    }
  }}

  /* Variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'outlined':
        return `
          border: 1px solid ${theme.colors.border};
          box-shadow: none;
        `
      case 'flat':
        return `
          background-color: ${theme.colors.muted};
          border: none;
          box-shadow: none;
        `
      case 'interactive':
        return `
          border: 1px solid ${theme.colors.border};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          cursor: pointer;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            border-color: #D4D4D8;
          }
        `
      case 'default':
      default:
        return `
          border: 1px solid ${theme.colors.border};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        `
    }
  }}
`

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: ${theme.spacing.md};
`

export const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CardDescription = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.border};
`

export const Card = ({
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) => {
  return (
    <StyledCard $variant={variant} $padding={padding} {...props}>
      {children}
    </StyledCard>
  )
}
