import type { ReactNode } from 'react'
import * as React from 'react'

import { Input as BaseInput } from '@base-ui/react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '../../theme'

export type InputSize = 'sm' | 'md' | 'lg'

export type InputProps = Omit<
  React.ComponentProps<typeof BaseInput>,
  'size'
> & {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'floating'
  size?: InputSize
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

export const Wrapper = styled.div<{ $variant?: 'default' | 'floating' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  position: ${({ $variant }) => ($variant === 'floating' ? 'relative' : 'static')};
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

export const Adornment = styled.div<{
  $position: 'start' | 'end'
  $size: InputSize
}>`
  position: absolute;
  ${({ $position, $size, theme }) => {
    const offset =
      $size === 'sm'
        ? theme.spacing.sm
        : $size === 'lg'
          ? theme.spacing.lg
          : theme.spacing.md
    return $position === 'start' ? `left: ${offset};` : `right: ${offset};`
  }}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 1;
`

export const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.caption};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`

export const FloatingLabel = styled(Label)<{
  $hasStartAdornment?: boolean
  $size?: InputSize
}>`
  position: absolute;
  left: ${({ theme, $hasStartAdornment, $size = 'md' }) => {
    if ($hasStartAdornment) {
      return $size === 'sm' ? '32px' : $size === 'lg' ? '64px' : '44px'
    }

    return $size === 'sm'
      ? theme.spacing.sm
      : $size === 'lg'
        ? theme.spacing.xl
        : theme.spacing.md
  }};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme, $size = 'md' }) =>
    $size === 'sm'
      ? theme.typography.sizes.caption
      : $size === 'lg'
        ? theme.typography.sizes.title
        : theme.typography.sizes.body};
  pointer-events: none;
  z-index: 1;
  transition:
    top 0.2s ease-in-out,
    left 0.2s ease-in-out,
    transform 0.2s ease-in-out,
    color 0.2s ease-in-out,
    font-size 0.2s ease-in-out;
  margin: 0;
`

export const inputBaseStyles = ({
  theme,
  hasError,
  $variant,
  $size = 'md',
}: {
  theme: Theme
  hasError?: boolean
  $variant?: 'default' | 'floating'
  $size?: InputSize
}) => css`
  font-family: ${theme.typography.fontFamily};
  font-size: ${
    $size === 'sm'
      ? theme.typography.sizes.body
      : $size === 'lg'
        ? theme.typography.sizes.title
        : theme.typography.sizes.body
  };
  border-radius: ${
    $size === 'sm'
      ? theme.radius.sm
      : $size === 'lg'
        ? theme.radius.lg
        : theme.radius.md
  };
  border: 1px solid ${hasError ? theme.colors.error : theme.colors.border};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: border-color 0.2s ease-in-out;
  outline: none;
  width: 100%;

  &:focus-visible {
    border-color: ${hasError ? theme.colors.error : theme.colors.secondary.DEFAULT};
  }

  &::placeholder {
    color: ${$variant === 'floating' ? 'transparent' : theme.colors.text.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.muted};
    cursor: not-allowed;
  }
`

const sizes = {
  sm: '44px',
  md: '52px',
  lg: '68px',
}

export const StyledInput = styled(BaseInput)<{
  hasError?: boolean
  $variant?: 'default' | 'floating'
  $size: InputSize
  $hasStartAdornment?: boolean
  $hasEndAdornment?: boolean
}>`
  ${inputBaseStyles}

  && {
    box-sizing: border-box;
    height: ${({ $size }) => sizes[$size]};
    min-height: ${({ $size }) => sizes[$size]};
  }

  padding: ${({
    theme,
    $variant,
    $size,
    $hasStartAdornment,
    $hasEndAdornment,
  }) => {
    const verticalPadding =
      $size === 'sm'
        ? theme.spacing.xs
        : $size === 'lg'
          ? theme.spacing.md
          : theme.spacing.sm
    const horizontalPadding =
      $size === 'sm'
        ? theme.spacing.sm
        : $size === 'lg'
          ? theme.spacing.xl
          : theme.spacing.md
    const adornmentPadding =
      $size === 'sm' ? '32px' : $size === 'lg' ? '64px' : '44px'
    const pl = $hasStartAdornment ? adornmentPadding : horizontalPadding
    const pr = $hasEndAdornment ? adornmentPadding : horizontalPadding
    return `${verticalPadding} ${pr} ${verticalPadding} ${pl}`
  }};

  /* Material-style outlined label: lift it into a notch in the border. */
  &:focus-visible ~ [data-floating-label],
  &:not(:placeholder-shown) ~ [data-floating-label] {
    top: 0;
    left: ${({ theme, $size }) =>
      $size === 'sm'
        ? theme.spacing.sm
        : $size === 'lg'
          ? theme.spacing.xl
          : theme.spacing.md};
    transform: translateY(-50%);
    padding: 0 4px;
    background-color: ${({ theme }) => theme.colors.background};
    font-size: ${({ theme, $size }) =>
      $size === 'sm'
        ? '10px'
        : $size === 'lg'
          ? theme.typography.sizes.body
          : theme.typography.sizes.caption};
    color: ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.text.primary)};
  }

  &:focus-visible ~ [data-floating-label] {
    color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.secondary.DEFAULT};
  }

  &:disabled ~ [data-floating-label] {
    background-color: ${({ theme }) => theme.colors.muted};
  }
`

export const HelperText = styled.span<{ isError?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.caption};
  color: ${({ theme, isError }) => (isError ? theme.colors.error : theme.colors.text.secondary)};
`

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      variant = 'floating',
      size = 'md',
      startAdornment,
      endAdornment,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    const placeholderProps =
      variant === 'floating' ? { placeholder: props.placeholder || ' ' } : {}

    return (
      <Wrapper className={className as string} $variant={variant}>
        {variant === 'default' && label && (
          <Label htmlFor={inputId}>{label}</Label>
        )}
        <InputWrapper>
          {startAdornment && (
            <Adornment $position="start" $size={size}>
              {startAdornment}
            </Adornment>
          )}
          <StyledInput
            ref={ref}
            id={inputId}
            hasError={!!error}
            $variant={variant}
            $size={size}
            $hasStartAdornment={!!startAdornment}
            $hasEndAdornment={!!endAdornment}
            {...props}
            {...placeholderProps}
          />
          {variant === 'floating' && label && (
            <FloatingLabel
              data-floating-label
              htmlFor={inputId}
              $hasStartAdornment={!!startAdornment}
              $size={size}
            >
              {label}
            </FloatingLabel>
          )}
          {endAdornment && (
            <Adornment $position="end" $size={size}>
              {endAdornment}
            </Adornment>
          )}
        </InputWrapper>
        {(error || helperText) && (
          <HelperText isError={!!error}>{error || helperText}</HelperText>
        )}
      </Wrapper>
    )
  },
)

Input.displayName = 'Input'
