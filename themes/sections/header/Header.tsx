import React from 'react'

import styled from '@emotion/styled'

import { BlockRenderer } from '#themes/blocks/BlockRenderer'
import type { SectionComponentProps } from '#themes/types/theme'

export interface HeaderSettings {
  logo_position?: 'middle-left' | 'top-left' | 'top-center'
  sticky_header_type?: 'none' | 'on-scroll-up' | 'always'
  show_line_separator?: boolean
  color_scheme?: string
  enable_country_selector?: boolean
  enable_language_selector?: boolean
  padding_top?: number
  padding_bottom?: number
  logo_text?: string
}

const HeaderWrapper = styled.header<{
  hasSeparator: boolean
  isSticky: boolean
}>`
  width: 100%;
  color: rgb(var(--color-foreground));
  background-color: rgb(var(--color-background));
  background: var(--gradient-background, rgb(var(--color-background)));
  border-bottom: ${({ hasSeparator }) =>
    hasSeparator
      ? '1px solid var(--color-border, rgba(0, 0, 0, 0.08))'
      : 'none'};
  position: ${({ isSticky }) => (isSticky ? 'sticky' : 'relative')};
  top: 0;
  z-index: 40;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
`

const HeaderContainer = styled.div<{
  paddingTop: number
  paddingBottom: number
  logoPosition: string
}>`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ paddingTop, paddingBottom }) =>
    `${paddingTop}px 24px ${paddingBottom}px 24px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`

const LogoArea = styled.div<{ position: string }>`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgb(var(--color-foreground));
`

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--color-foreground), 0.8);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: rgb(var(--color-foreground));
  }
`

const ActionsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: rgb(var(--color-foreground));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--color-card, rgba(var(--color-foreground), 0.08));
  }
`

const CartBadge = styled.span`
  background-color: rgb(var(--color-button));
  color: rgb(var(--color-button-text));
  font-size: 11px;
  font-weight: 700;
  border-radius: 9999px;
  padding: 2px 6px;
  margin-left: 4px;
`

export const Header: React.FC<SectionComponentProps<HeaderSettings>> = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}) => {
  const {
    logo_position = 'middle-left',
    sticky_header_type = 'on-scroll-up',
    show_line_separator = true,
    color_scheme = 'scheme-1',
    padding_top = 20,
    padding_bottom = 20,
    logo_text = 'Teras Sapa',
  } = settings

  const isSticky = sticky_header_type !== 'none'

  return (
    <HeaderWrapper
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      hasSeparator={show_line_separator}
      isSticky={isSticky}
    >
      {/* 1. Render Child Blocks (e.g. Announcement Bar) via BlockRenderer */}
      {blockOrder.map((blockId) => {
        const block = blocks[blockId]

        return (
          <BlockRenderer
            key={blockId}
            sectionId={id}
            blockId={blockId}
            block={block}
            isEditor={isEditor}
          />
        )
      })}

      {/* 2. Main Header Bar */}
      <HeaderContainer
        paddingTop={padding_top}
        paddingBottom={padding_bottom}
        logoPosition={logo_position}
      >
        <LogoArea position={logo_position}>
          <span>🛍️</span>
          <span>{logo_text}</span>
        </LogoArea>

        <NavMenu>
          <NavItem href="/">Home</NavItem>
          <NavItem href="/collections/all">Catalog</NavItem>
          <NavItem href="/about">About</NavItem>
          <NavItem href="/contact">Contact</NavItem>
        </NavMenu>

        <ActionsArea>
          <IconButton title="Search" aria-label="Search">
            🔍
          </IconButton>
          <IconButton title="Account" aria-label="Account">
            👤
          </IconButton>
          <IconButton title="Cart" aria-label="Cart">
            🛒 <CartBadge>2</CartBadge>
          </IconButton>
        </ActionsArea>
      </HeaderContainer>
    </HeaderWrapper>
  )
}
