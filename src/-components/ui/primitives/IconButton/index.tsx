import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'

export type IconButtonVariant =
  'ghost' | 'dark' | 'outline' | 'primary' | 'secondary' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  badge?: boolean | number
  children: ReactNode
}

const StyledIconButton = styled.button<{
  $variant: IconButtonVariant
  $size: IconButtonSize
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.radius.md};
  cursor: pointer;
  position: relative;
  transition: all 0.18s ease;
  outline: none;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Sizes */
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return `
          width: 20px;
          height: 20px;
          padding: 4px;
        `
      case 'lg':
        return `
          width: 42px;
          height: 42px;
          padding: 8px;
        `
      case 'md':
      default:
        return `
          width: 34px;
          height: 34px;
          padding: 6px;
        `
    }
  }}

  /* Variants */
  ${({ $variant }) => {
    switch ($variant) {
      case 'dark':
        return `
          background-color: transparent;
          color: #cccccc;
          &:hover:not(:disabled) {
            background-color: #303030;
            color: #ffffff;
          }
        `
      case 'outline':
        return `
          background-color: transparent;
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.muted};
          }
        `
      case 'primary':
        return `
          background-color: ${theme.colors.primary.DEFAULT};
          color: #ffffff;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary.DEFAULT};
          color: #ffffff;
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
        `
      case 'danger':
        return `
          background-color: transparent;
          color: ${theme.colors.error};
          &:hover:not(:disabled) {
            background-color: rgba(219, 65, 83, 0.1);
          }
        `
      case 'ghost':
      default:
        return `
          background-color: transparent;
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.muted};
          }
        `
    }
  }}
`

const DotBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${theme.colors.primary.DEFAULT};
  border: 1.5px solid #1a1a1a;
`

const NumberBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.primary.DEFAULT};
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: ${theme.typography.weights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #1a1a1a;
`

export const IconButton = ({
  variant = 'ghost',
  size = 'md',
  badge,
  children,
  ...props
}: IconButtonProps) => {
  return (
    <StyledIconButton $variant={variant} $size={size} {...props}>
      {children}
      {typeof badge === 'number' && <NumberBadge>{badge}</NumberBadge>}
      {badge === true && <DotBadge />}
    </StyledIconButton>
  )
}
