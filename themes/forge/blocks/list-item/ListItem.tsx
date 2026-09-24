import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface ListItemSettings {
  number?: string
  title?: string
  description?: string
  link_url?: string
  arrow_icon?: 'none' | 'up_right' | 'down_right'
}

const ItemContainer = styled(Link)<{ isLink: boolean }>`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 20px;
  align-items: start;
  padding: 24px 0;
  color: inherit;
  text-decoration: none;
  box-shadow: inset 0 1px rgba(23, 25, 21, 0.1);
  width: 100%;
  box-sizing: border-box;
  transition:
    transform 650ms var(--forge-ease),
    opacity 650ms var(--forge-ease);
  cursor: ${({ isLink }) => (isLink ? 'pointer' : 'default')};

  &:hover {
    transform: ${({ isLink }) => (isLink ? 'translateX(8px)' : 'none')};
  }

  small {
    color: #7b7e76;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
  }

  strong {
    font: 520 clamp(23px, 2.5vw, 34px) / 1.1 var(--forge-heading);
    letter-spacing: -0.045em;
    color: inherit;
  }

  p {
    grid-column: 2 / -1;
    max-width: 560px;
    margin: 6px 0 0;
    color: #676a63;
    font-size: 13px;
    line-height: 1.5;
  }

  .arrow-indicator {
    font-size: 18px;
    color: inherit;
    transition: transform 650ms var(--forge-ease);
  }

  &:hover .arrow-indicator {
    transform: translate(2px, -2px);
  }
`

export const ListItem: React.FC<BlockComponentProps<ListItemSettings>> = ({
  settings,
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
      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      {arrowSymbol && <span className="arrow-indicator">{arrowSymbol}</span>}
    </>
  )

  if (isLink) {
    return (
      <ItemContainer href={link_url} isLink={true} style={{ color: 'inherit' }}>
        {content}
      </ItemContainer>
    )
  }

  return <ItemContainer isLink={false}>{content}</ItemContainer>
}
