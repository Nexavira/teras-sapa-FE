import type { ReactNode } from 'react'
import * as React from 'react'

import { Button as BaseButton } from '@base-ui/react'
import styled from '@emotion/styled'

import type { Theme } from '../../theme'
import { theme as defaultTheme } from '../../theme'

export type ButtonVariant = 'solid' | 'ghost' | 'outline'
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  isLoading?: boolean
  children?: ReactNode
}

interface StyledButtonProps {
  $variant: ButtonVariant
  $color: ButtonColor
  $size: ButtonSize
}

const getColorTokens = (theme: Theme, color: ButtonColor) => {
  switch (color) {
    case 'secondary':
      return {
        main: theme.colors.secondary,
        contrast: theme.colors.text.inverse,
        subtleBg: '#E6F7F5',
        subtleBorder: '#B8EBE6',
      }
    case 'danger':
      return {
        main: theme.colors.error,
        contrast: theme.colors.text.inverse,
        subtleBg: '#FEE2E2',
        subtleBorder: '#FECACA',
      }
    case 'success':
      return {
        main: theme.colors.success,
        contrast: theme.colors.text.inverse,
        subtleBg: '#E6F7F5',
        subtleBorder: '#B8EBE6',
      }
    case 'warning':
      return {
        main: '#D97706',
        contrast: theme.colors.text.inverse,
        subtleBg: '#FFF8E6',
        subtleBorder: '#FEE685',
      }
    case 'info':
      return {
        main: '#2563EB',
        contrast: theme.colors.text.inverse,
        subtleBg: '#EFF6FF',
        subtleBorder: '#BFDBFE',
      }
    case 'neutral':
      return {
        main: theme.colors.text.primary,
        contrast: theme.colors.text.inverse,
        subtleBg: theme.colors.muted,
        subtleBorder: theme.colors.border,
      }
    case 'primary':
    default:
      return {
        main: theme.colors.primary,
        contrast: theme.colors.text.inverse,
        subtleBg: '#FFF0F1',
        subtleBorder: '#FFD1D4',
      }
  }
}

const getButtonStyles = (
  theme: Theme,
  variant: ButtonVariant,
  color: ButtonColor,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const currentTheme = theme || defaultTheme
  const tokens = getColorTokens(currentTheme, color)

  switch (variant) {
    case 'outline':
      return `
        background-color: transparent;
        color: ${color === 'neutral' ? currentTheme.colors.text.primary : tokens.main};
        border: 1px solid ${color === 'neutral' ? currentTheme.colors.border : tokens.main};
        &:hover:not(:disabled) {
          background-color: ${tokens.subtleBg};
          border-color: ${color === 'neutral' ? currentTheme.colors.text.secondary : tokens.main};
        }
      `
    case 'ghost':
      return `
        background-color: transparent;
        color: ${color === 'neutral' ? currentTheme.colors.text.primary : tokens.main};
        border: 1px solid transparent;
        &:hover:not(:disabled) {
          background-color: ${tokens.subtleBg};
        }
      `
    case 'solid':
    default:
      return `
        background-color: ${tokens.main};
        color: ${tokens.contrast};
        border: 1px solid ${tokens.main};
        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      `
  }
}

const StyledButton = styled(BaseButton)<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.typography.fontFamily || defaultTheme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weights.medium || defaultTheme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  box-sizing: border-box;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  /* Sizes */
  ${({ theme, $size }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const currentTheme = theme || defaultTheme
    switch ($size) {
      case 'icon':
        return `
          padding: ${currentTheme.spacing.xs};
          border-radius: ${currentTheme.radius.md};
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        `
      case 'sm':
        return `
          padding: ${currentTheme.spacing.xs} ${currentTheme.spacing.sm};
          font-size: ${currentTheme.typography.sizes.caption};
          border-radius: ${currentTheme.radius.sm};
        `
      case 'lg':
        return `
          padding: ${currentTheme.spacing.md} ${currentTheme.spacing.xl};
          font-size: ${currentTheme.typography.sizes.title};
          border-radius: ${currentTheme.radius.lg};
        `
      case 'md':
      default:
        return `
          padding: ${currentTheme.spacing.sm} ${currentTheme.spacing.md};
          font-size: ${currentTheme.typography.sizes.body};
          border-radius: ${currentTheme.radius.md};
        `
    }
  }}

  /* Variants and Colors */
  ${({ theme, $variant, $color }) => getButtonStyles(theme, $variant, $color)}
`

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $color={color}
        $size={size}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </StyledButton>
    )
  },
)

Button.displayName = 'Button'
