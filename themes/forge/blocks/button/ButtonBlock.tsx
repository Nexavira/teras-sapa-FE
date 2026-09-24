import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ButtonBlockSettings {
  button_label?: string
  button_link?: string
  button_style?: 'primary' | 'accent' | 'outline'
  button_size?: 'small' | 'medium' | 'large'
}

const StyledCTA = styled.a<{
  buttonStyle: 'primary' | 'accent' | 'outline'
  buttonSize: 'small' | 'medium' | 'large'
}>`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: var(--forge-button-border-width) solid transparent;
  border-radius: var(--forge-button-radius);
  text-decoration: none;
  font-weight: 700;
  letter-spacing: var(--forge-button-letter-spacing);
  text-transform: var(--forge-button-text-transform);
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 600ms var(--forge-ease),
    background 600ms var(--forge-ease),
    box-shadow 600ms var(--forge-ease),
    border-color 600ms var(--forge-ease);

  ${({ buttonSize }) => {
    switch (buttonSize) {
      case 'small':
        return `
          padding: 4px 6px 4px 14px;
          font-size: 11px;
        `
      case 'large':
        return `
          padding: 8px 10px 8px 24px;
          font-size: 14px;
        `
      case 'medium':
      default:
        return `
          padding: 6px 8px 6px 18px;
          font-size: 12px;
        `
    }
  }}

  span.arrow-badge {
    display: grid;
    place-items: center;
    border-radius: 50%;
    transition: transform 600ms var(--forge-ease);

    ${({ buttonSize }) => {
      switch (buttonSize) {
        case 'small':
          return `
            width: 28px;
            height: 28px;
            font-size: 11px;
          `
        case 'large':
          return `
            width: 42px;
            height: 42px;
            font-size: 15px;
          `
        case 'medium':
        default:
          return `
            width: 34px;
            height: 34px;
            font-size: 13px;
          `
      }
    }}
  }

  &:hover {
    transform: translateY(-2px);
    span.arrow-badge {
      transform: translate(3px, -2px) scale(1.06);
    }
  }

  [data-forge-button-hover='none'] &:hover {
    transform: none;
    box-shadow: none;
  }

  [data-forge-button-hover='scale'] &:hover {
    transform: scale(1.02);
  }

  [data-forge-button-hover='brightness'] &:hover {
    transform: none;
    filter: brightness(1.08);
  }

  &:active {
    transform: scale(0.98);
  }

  ${({ buttonStyle }) => {
    switch (buttonStyle) {
      case 'accent':
        return `
          background: var(--forge-orange);
          color: var(--forge-ink);
          border-color: var(--forge-orange);
          span.arrow-badge {
            background: var(--forge-ink);
            color: var(--forge-paper);
          }
          &:hover {
            box-shadow: var(--forge-button-shadow);
          }
        `
      case 'outline':
        return `
          background: transparent;
          color: inherit;
          border-color: rgba(var(--color-foreground), 0.28);
          span.arrow-badge {
            background: rgba(var(--color-foreground), 0.08);
            color: inherit;
          }
          &:hover {
            border-color: rgb(var(--color-foreground));
            background: rgba(var(--color-foreground), 0.04);
          }
        `
      case 'primary':
      default:
        return `
          background: rgb(var(--color-button));
          color: rgb(var(--color-button-text));
          border-color: rgb(var(--color-button));
          span.arrow-badge {
            background: var(--forge-orange);
            color: var(--forge-ink);
          }
          &:hover {
            box-shadow: var(--forge-button-shadow);
          }
        `
    }
  }}
`

export const ButtonBlock: React.FC<
  BlockComponentProps<ButtonBlockSettings>
> = ({ settings }) => {
  const {
    button_label = 'Explore capabilities',
    button_link = '/preview?theme=forge&template=capabilities',
    button_style = 'primary',
    button_size = 'medium',
  } = settings

  if (!button_label) return null

  return (
    <StyledCTA
      href={button_link}
      buttonStyle={button_style}
      buttonSize={button_size}
    >
      {button_label}
      <span className="arrow-badge" aria-hidden="true">
        ↗
      </span>
    </StyledCTA>
  )
}
