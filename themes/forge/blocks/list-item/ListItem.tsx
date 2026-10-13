import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ListItemSettings {
  number?: string
  title?: string
  description?: string
  link_url?: string
  arrow_icon?: 'none' | 'up_right' | 'down_right'
}

const ItemContainer = styled.div<{ isLink: boolean; href?: string }>`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: clamp(16px, 2.2vw, 24px);
  align-items: start;
  padding: clamp(18px, 2.2vw, 26px) clamp(16px, 2vw, 22px);
  border-radius: var(--forge-card-radius, 18px);
  background: rgba(currentColor, 0.02);
  border: 1px solid rgba(currentColor, 0.08);
  color: inherit;
  text-decoration: none;
  box-sizing: border-box;
  width: 100%;
  cursor: ${({ isLink }) => (isLink ? 'pointer' : 'default')};
  transition:
    transform 550ms var(--forge-ease),
    background 550ms var(--forge-ease),
    border-color 550ms var(--forge-ease),
    box-shadow 550ms var(--forge-ease);
  overflow: hidden;

  /* Left accent marker on hover */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 3px;
    height: 32px;
    background: var(--forge-orange);
    border-radius: 0 3px 3px 0;
    transition: transform 450ms var(--forge-ease);
  }

  &:hover {
    transform: ${({ isLink }) => (isLink ? 'translateX(6px)' : 'translateX(4px)')};
    background: rgba(currentColor, 0.045);
    border-color: rgba(241, 90, 36, 0.4);
    box-shadow:
      0 12px 28px -8px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    &::before {
      transform: translateY(-50%) scaleY(1);
    }

    small {
      background: var(--forge-orange);
      color: #171915;
      border-color: var(--forge-orange);
      opacity: 1;
    }

    .arrow-circle {
      background: var(--forge-orange);
      color: #171915;
      border-color: var(--forge-orange);
      transform: translate(2px, -2px) scale(1.08);
    }
  }

  small {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 5px 9px;
    border-radius: var(--forge-pill-radius);
    background: rgba(currentColor, 0.06);
    border: 1px solid rgba(currentColor, 0.12);
    color: inherit;
    font-family: var(--forge-heading);
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.14em;
    opacity: 0.85;
    transition: all 450ms var(--forge-ease);
    box-sizing: border-box;
    font-variant-numeric: tabular-nums;
  }

  .content-body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  strong {
    font: 520 clamp(22px, 2.6vw, 34px) / 1.12 var(--forge-heading);
    letter-spacing: -0.04em;
    color: inherit;
    transition: color 300ms ease;
  }

  p {
    margin: 8px 0 0;
    max-width: 540px;
    color: inherit;
    opacity: 0.72;
    font-size: 14px;
    line-height: 1.55;
    letter-spacing: -0.01em;
  }

  .arrow-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrow-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(currentColor, 0.05);
    border: 1px solid rgba(currentColor, 0.12);
    color: inherit;
    font-size: 16px;
    font-weight: 700;
    transition:
      transform 450ms var(--forge-ease),
      background 450ms var(--forge-ease),
      color 450ms var(--forge-ease),
      border-color 450ms var(--forge-ease);
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 14px;

    .arrow-indicator {
      justify-content: flex-end;
    }
  }
`

export const ListItem: React.FC<BlockComponentProps<ListItemSettings>> = ({
  settings,
  ...restProps
}) => {
  const {
    number = '01',
    title = 'Design for manufacture',
    description,
    link_url,
    arrow_icon = 'none',
  } = settings

  const isLink = Boolean(link_url)
  const arrowSymbol =
    arrow_icon === 'up_right'
      ? '↗'
      : arrow_icon === 'down_right'
        ? '↘'
        : isLink
          ? '↗'
          : null

  const content = (
    <>
      <small>{number}</small>
      <div className="content-body">
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      {arrowSymbol && (
        <span className="arrow-indicator">
          <span className="arrow-circle">{arrowSymbol}</span>
        </span>
      )}
    </>
  )

  if (isLink) {
    return (
      <ItemContainer
        as="a"
        href={link_url}
        isLink={true}
        style={{ color: 'inherit' }}
        {...restProps}
      >
        {content}
      </ItemContainer>
    )
  }

  return (
    <ItemContainer isLink={false} {...restProps}>
      {content}
    </ItemContainer>
  )
}

