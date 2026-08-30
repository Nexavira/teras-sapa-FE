import React from 'react'

import styled from '@emotion/styled'
import {
  Cancel01Icon,
  Menu01Icon,
  Search01Icon,
  ShoppingCart01Icon,
  UserCircleIcon,
} from 'hugeicons-react'

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
  menu_links?: string
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
  max-width: var(--page-width, 1280px);
  margin: 0 auto;
  padding: ${({ paddingTop, paddingBottom }) =>
    `${paddingTop}px 24px ${paddingBottom}px 24px`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: 768px) {
    padding-left: var(--gutter-mobile, 16px);
    padding-right: var(--gutter-mobile, 16px);
  }
`

const LogoArea = styled.div<{ position: string }>`
  font-family: var(--font-heading, serif);
  font-size: 28px;
  font-weight: var(--font-heading-weight, 500);
  letter-spacing: -0.045em;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: rgb(var(--color-foreground));
`

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-right: auto;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavItem = styled.a`
  padding: 5px 0;
  border-bottom: 1px solid transparent;
  font-size: 13px;
  font-weight: 400;
  color: rgba(var(--color-foreground), 0.8);
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: rgb(var(--color-foreground));
    border-bottom-color: currentColor;
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
  border-radius: 50%;
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
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  padding: 0;
  margin: -16px 0 0 -10px;
`

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`

const DesktopUtility = styled(IconButton)`
  @media (max-width: 540px) {
    display: none;
  }
`

const MobileNav = styled.nav<{ open: boolean }>`
  display: ${({ open }) => (open ? 'grid' : 'none')};
  gap: 0;
  padding: 10px var(--gutter-mobile, 16px) 24px;
  border-top: 1px solid rgba(var(--color-foreground), 0.1);

  a {
    padding: 14px 0;
    border-bottom: 1px solid rgba(var(--color-foreground), 0.1);
    color: inherit;
    font-size: 15px;
    text-decoration: none;
  }
`

const parseMenuLinks = (value: string) =>
  value
    .split(',')
    .map((item) => {
      const [label, href] = item.split('|').map((part) => part.trim())
      return { label, href: href || '#' }
    })
    .filter((item) => item.label)

export const Header: React.FC<SectionComponentProps<HeaderSettings>> = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const {
    logo_position = 'middle-left',
    sticky_header_type = 'on-scroll-up',
    show_line_separator = true,
    color_scheme = 'scheme-1',
    padding_top = 20,
    padding_bottom = 20,
    logo_text = 'Serein',
    menu_links = 'New arrivals|/collections/new, Shop|/collections/all, Journal|/blogs/journal, Our story|/pages/about',
  } = settings

  const isSticky = sticky_header_type !== 'none'
  const menuLinks = parseMenuLinks(menu_links)

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
        <MobileMenuButton
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          {isMenuOpen ? (
            <Cancel01Icon aria-hidden="true" size={22} />
          ) : (
            <Menu01Icon aria-hidden="true" size={22} />
          )}
        </MobileMenuButton>

        <LogoArea position={logo_position}>
          <span>{logo_text}</span>
        </LogoArea>

        <NavMenu>
          {menuLinks.map((item) => (
            <NavItem href={item.href} key={`${item.label}-${item.href}`}>
              {item.label}
            </NavItem>
          ))}
        </NavMenu>

        <ActionsArea>
          <DesktopUtility title="Search" aria-label="Search">
            <Search01Icon aria-hidden="true" size={20} />
          </DesktopUtility>
          <DesktopUtility title="Account" aria-label="Account">
            <UserCircleIcon aria-hidden="true" size={20} />
          </DesktopUtility>
          <IconButton title="Cart" aria-label="Cart">
            <ShoppingCart01Icon aria-hidden="true" size={20} />
            <CartBadge>2</CartBadge>
          </IconButton>
        </ActionsArea>
      </HeaderContainer>
      <MobileNav aria-label="Mobile navigation" open={isMenuOpen}>
        {menuLinks.map((item) => (
          <a href={item.href} key={`${item.label}-${item.href}-mobile`}>
            {item.label}
          </a>
        ))}
      </MobileNav>
    </HeaderWrapper>
  )
}
