import type { ReactNode } from 'react'
import * as React from 'react'

import { Input as BaseInput } from '@base-ui/react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Theme } from '../../theme'

export type InputProps = React.ComponentProps<typeof BaseInput> & {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'floating'
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

export const Adornment = styled.div<{ $position: 'start' | 'end' }>`
  position: absolute;
  ${({ $position, theme }) => ($position === 'start' ? `left: ${theme.spacing.md};` : `right: ${theme.spacing.md};`)}
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

export const FloatingLabel = styled(Label)<{ $hasStartAdornment?: boolean }>`
  position: absolute;
  left: ${({ theme, $hasStartAdornment }) => ($hasStartAdornment ? '44px' : theme.spacing.md)};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.body};
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  margin: 0;
`

export const inputBaseStyles = ({
  theme,
  hasError,
  $variant,
}: {
  theme: Theme
  hasError?: boolean
  $variant?: 'default' | 'floating'
}) => css`
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.sizes.body};
  border-radius: ${theme.radius.md};
  border: 1px solid ${hasError ? theme.colors.error : theme.colors.border};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
  transition: border-color 0.2s ease-in-out;
  outline: none;
  width: 100%;

  &:focus-visible {
    border-color: ${hasError ? theme.colors.error : theme.colors.secondary};
  }

  &::placeholder {
    color: ${$variant === 'floating' ? 'transparent' : theme.colors.text.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.muted};
    cursor: not-allowed;
  }
`

export const StyledInput = styled(BaseInput)<{
  hasError?: boolean
  $variant?: 'default' | 'floating'
  $hasStartAdornment?: boolean
  $hasEndAdornment?: boolean
}>`
  ${inputBaseStyles}
  padding: ${({ theme, $variant, $hasStartAdornment, $hasEndAdornment }) => {
    const pt = $variant === 'floating' ? '25px' : theme.spacing.sm
    const pb = $variant === 'floating' ? '8px' : theme.spacing.sm
    const pl = $hasStartAdornment ? '44px' : theme.spacing.md
    const pr = $hasEndAdornment ? '44px' : theme.spacing.md
    return `${pt} ${pr} ${pb} ${pl}`
  }};

  /* Floating Label Styles */
  &:focus-visible
    ~ ${FloatingLabel},
    &:not(:placeholder-shown)
    ~ ${FloatingLabel} {
    top: 8px;
    transform: translateY(0);
    font-size: ${({ theme }) => theme.typography.sizes.caption};
    color: ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.text.primary)};
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
            <Adornment $position="start">{startAdornment}</Adornment>
          )}
          <StyledInput
            ref={ref}
            id={inputId}
            hasError={!!error}
            $variant={variant}
            $hasStartAdornment={!!startAdornment}
            $hasEndAdornment={!!endAdornment}
            {...props}
            {...placeholderProps}
          />
          {variant === 'floating' && label && (
            <FloatingLabel
              htmlFor={inputId}
              $hasStartAdornment={!!startAdornment}
            >
              {label}
            </FloatingLabel>
          )}
          {endAdornment && (
            <Adornment $position="end">{endAdornment}</Adornment>
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
