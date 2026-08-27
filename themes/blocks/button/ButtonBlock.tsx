import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/types/theme'

export interface ButtonBlockSettings {
  button_label?: string
  button_link?: string
  button_style?: 'primary' | 'accent' | 'outline'
}

const StyledCTA = styled.a<{ buttonStyle: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--button-radius, 8px);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ buttonStyle }) => {
    switch (buttonStyle) {
      case 'accent':
        return `
          background-color: var(--color-info, #2563eb);
          color: #ffffff;
          border: 1px solid var(--color-info, #2563eb);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }
        `
      case 'outline':
        return `
          background-color: transparent;
          color: rgb(var(--color-secondary-button-text));
          border: 1.5px solid rgb(var(--color-secondary-button));
          &:hover {
            background-color: rgba(var(--color-foreground), 0.08);
            transform: translateY(-2px);
          }
        `
      case 'primary':
      default:
        return `
          background-color: rgb(var(--color-button));
          color: rgb(var(--color-button-text));
          border: 1px solid rgb(var(--color-button));
          box-shadow: 0 4px 14px rgba(var(--color-shadow), 0.15);
          &:hover {
            opacity: 0.92;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(var(--color-shadow), 0.25);
          }
        `
    }
  }}
`

export const ButtonBlock: React.FC<
  BlockComponentProps<ButtonBlockSettings>
> = ({ settings }) => {
  const {
    button_label = 'Shop Collection',
    button_link = '/collections/all',
    button_style = 'primary',
  } = settings

  if (!button_label) return null

  return (
    <StyledCTA href={button_link} buttonStyle={button_style}>
      {button_label}
    </StyledCTA>
  )
}
