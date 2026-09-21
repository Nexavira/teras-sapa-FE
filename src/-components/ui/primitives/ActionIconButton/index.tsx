import type { ButtonHTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'

export interface ActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean
  children: ReactNode
}

const StyledButton = styled.button<{ $danger?: boolean }>`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background: ${theme.colors.white};
  color: ${({ $danger }) => ($danger ? '#dc2626' : theme.colors.text.primary)};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    border-color: ${({ $danger }) =>
      $danger ? '#dc2626' : theme.colors.primary.DEFAULT};
    background: ${({ $danger }) =>
      $danger ? 'rgba(220, 38, 38, 0.08)' : theme.colors.paper};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ActionIconButton = ({
  danger,
  children,
  type = 'button',
  ...props
}: ActionIconButtonProps) => {
  return (
    <StyledButton type={type} $danger={danger} {...props}>
      {children}
    </StyledButton>
  )
}
