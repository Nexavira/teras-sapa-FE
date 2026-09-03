import * as React from 'react'

import styled from '@emotion/styled'

import {
  FloatingLabel,
  HelperText,
  inputBaseStyles,
  Label,
  Wrapper,
} from '../Input'

export type TextareaProps = React.ComponentProps<'textarea'> & {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'floating'
}

// Create a textarea specific floating label that sits at the top instead of middle
const TextareaFloatingLabel = styled(FloatingLabel)`
  top: 24px;
  transform: none; /* Override the default translate(-50%) */
`

const StyledTextarea = styled.textarea<{
  hasError?: boolean
  $variant?: 'default' | 'floating'
}>`
  ${inputBaseStyles}
  padding: ${({ theme, $variant }) =>
    $variant === 'floating'
      ? `25px ${theme.spacing.md} 12px`
      : `${theme.spacing.sm} ${theme.spacing.md}`};

  resize: vertical;
  min-height: 120px;

  /* Floating Label Styles */
  &:focus-visible
    ~ ${TextareaFloatingLabel},
    &:not(:placeholder-shown)
    ~ ${TextareaFloatingLabel} {
    top: 8px;
    font-size: ${({ theme }) => theme.typography.sizes.caption};
    color: ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.text.primary)};
  }
`

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, className, id, variant = 'floating', ...props },
    ref,
  ) => {
    const textareaId =
      id ||
      (label
        ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`
        : undefined)

    const placeholderProps =
      variant === 'floating' ? { placeholder: props.placeholder || ' ' } : {}

    return (
      <Wrapper className={className} $variant={variant}>
        {variant === 'default' && label && (
          <Label htmlFor={textareaId}>{label}</Label>
        )}
        <StyledTextarea
          ref={ref}
          id={textareaId}
          hasError={!!error}
          $variant={variant}
          {...props}
          {...placeholderProps}
        />
        {variant === 'floating' && label && (
          <TextareaFloatingLabel htmlFor={textareaId}>
            {label}
          </TextareaFloatingLabel>
        )}
        {(error || helperText) && (
          <HelperText isError={!!error}>{error || helperText}</HelperText>
        )}
      </Wrapper>
    )
  },
)

Textarea.displayName = 'Textarea'
