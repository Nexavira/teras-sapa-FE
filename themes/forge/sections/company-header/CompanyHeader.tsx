import React, { useEffect, useState } from 'react'

import styled from '@emotion/styled'

import { useForgeSettings } from '../../settings-context'
import type {
  SectionComponentProps,
  UrlValue,
} from '#themes/shared/types/theme'

interface HeaderSettings {
  color_scheme?: string
  logo_text?: string
  cta_label?: string
  cta_url?: string | UrlValue
}

const HeaderLayer = styled.header`
  position: relative;
  z-index: 20;
  height: 0;
`

const Nav = styled.nav`
  position: fixed;
  top: 24px;
  left: 50%;
  z-index: 20;
  display: flex;
  width: min(calc(var(--forge-page-width) - 48px), calc(100vw - 48px));
  min-height: 66px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 9px 8px 22px;
  transform: translateX(-50%);
  border-radius: var(--forge-pill-radius);
  background: rgba(244, 241, 233, 0.84);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.66),
    0 18px 60px rgba(23, 25, 21, 0.08);
  backdrop-filter: blur(22px);

  @media (max-width: 767px) {
    top: 14px;
    width: calc(100vw - 28px);
    min-height: 58px;
    padding-left: 17px;
  }
`

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  font: 650 12px/1 var(--forge-heading);
  letter-spacing: 0.11em;
  white-space: nowrap;
`

const LogoMark = styled.span`
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  background: var(--forge-ink);
  color: var(--forge-paper);

  svg {
    width: 15px;
  }
`

const BrandLogo = styled.picture`
  display: block;
  line-height: 0;

  img {
    display: block;
    width: min(var(--forge-logo-width), 40vw);
    max-height: 40px;
    object-fit: contain;
    object-position: left center;
  }

  @media (max-width: 767px) {
    img {
      width: min(var(--forge-logo-width-mobile), 48vw);
      max-height: 34px;
    }
  }
`

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 26px;

  a {
    position: relative;
    text-decoration: none;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  a::after {
    position: absolute;
    right: 0;
    bottom: -5px;
    left: 0;
    height: 1px;
    background: currentColor;
    content: '';
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 650ms var(--forge-ease);
  }

  a:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  @media (max-width: 880px) {
    display: none;
  }
`

const NavCta = styled.a`
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 5px 6px 5px 18px;
  border-radius: var(--forge-button-radius);
  border: var(--forge-button-border-width, 1px) solid transparent;
  background: var(--forge-ink);
  color: var(--forge-paper);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: var(--forge-button-letter-spacing, 0px);
  text-transform: var(--forge-button-text-transform, none);
  box-shadow: var(--forge-button-shadow, none);
  transition:
    transform 650ms var(--forge-ease),
    background 650ms var(--forge-ease);

  span {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }
  &:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 880px) {
    display: none;
  }
`

const MenuButton = styled.button<{ open: boolean }>`
  position: relative;
  display: none;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--forge-ink);
  cursor: pointer;

  i {
    position: absolute;
    top: 50%;
    left: 12px;
    display: block;
    width: 18px;
    height: 1px;
    background: var(--forge-paper);
    transition: transform 650ms var(--forge-ease);
  }
  i:first-of-type {
    transform: ${({ open }) => (open ? 'rotate(45deg)' : 'translateY(-4px)')};
  }
  i:last-of-type {
    transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'translateY(4px)')};
  }
  @media (max-width: 880px) {
    display: block;
  }
`

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 10;
  display: grid;
  align-content: center;
  padding: 110px 24px 40px;
  background: rgba(23, 25, 21, 0.94);
  color: var(--forge-paper);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  backdrop-filter: blur(30px);
  transition: opacity 700ms var(--forge-ease);

  a {
    display: flex;
    justify-content: space-between;
    padding: 14px 0;
    text-decoration: none;
    font: 520 clamp(34px, 10vw, 58px)/1.05 var(--forge-heading);
    letter-spacing: -0.05em;
    opacity: ${({ open }) => (open ? 1 : 0)};
    transform: translateY(${({ open }) => (open ? '0' : '44px')});
    transition:
      transform 800ms var(--forge-ease),
      opacity 800ms var(--forge-ease);
  }
  a:nth-of-type(2) {
    transition-delay: 60ms;
  }
  a:nth-of-type(3) {
    transition-delay: 120ms;
  }
  a:nth-of-type(4) {
    transition-delay: 180ms;
  }
  a:nth-of-type(5) {
    transition-delay: 240ms;
  }
`

const navItems = [
  ['About', 'about'],
  ['Capabilities', 'capabilities'],
  ['Industries', 'industries'],
  ['Projects', 'projects'],
  ['Insights', 'insights'],
]
const mobileNavItems = [
  ...navItems,
  ['Sustainability', 'sustainability'],
  ['Careers', 'careers'],
  ['Contact', 'contact'],
]
const pageUrl = (template: string) =>
  `/preview?theme=forge&template=${template}`

export const CompanyHeader: React.FC<SectionComponentProps<HeaderSettings>> = ({
  id,
  settings,
}) => {
  const [open, setOpen] = useState(false)
  const globalSettings = useForgeSettings()
  const { color_scheme = 'scheme-1' } = settings
  const ctaUrl =
    typeof settings.cta_url === 'string'
      ? settings.cta_url
      : settings.cta_url?.url

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <HeaderLayer
      className={`color-${color_scheme}`}
      data-color-scheme={color_scheme}
      id={id}
    >
      <Nav aria-label="Main navigation">
        <Logo href={pageUrl('index')}>
          {globalSettings.logo ? (
            <BrandLogo>
              {globalSettings.logo_mobile && (
                <source
                  media="(max-width: 767px)"
                  srcSet={globalSettings.logo_mobile}
                />
              )}
              <img
                alt={globalSettings.company_name || 'Company logo'}
                src={globalSettings.logo}
              />
            </BrandLogo>
          ) : (
            <>
              <LogoMark aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 15 10 3l7 12M6 11h8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </LogoMark>
              {settings.logo_text && settings.logo_text !== 'ATLAS / INDUSTRIES'
                ? settings.logo_text
                : globalSettings.company_name ||
                  globalSettings.shop_name ||
                  settings.logo_text ||
                  'ATLAS / INDUSTRIES'}
            </>
          )}
        </Logo>
        <Links>
          {navItems.map(([label, page]) => (
            <a key={page} href={pageUrl(page)}>
              {label}
            </a>
          ))}
        </Links>
        <NavCta href={ctaUrl || pageUrl('contact')}>
          {settings.cta_label || 'Start a project'}{' '}
          <span aria-hidden="true">↗</span>
        </NavCta>
        <MenuButton
          type="button"
          open={open}
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <i />
          <i />
        </MenuButton>
      </Nav>
      <Overlay open={open} aria-hidden={!open}>
        {mobileNavItems.map(([label, page], index) => (
          <a
            key={page}
            href={pageUrl(page)}
            style={{ transitionDelay: `${index * 60}ms` }}
            onClick={() => setOpen(false)}
          >
            {label}
            <small>0{index + 1}</small>
          </a>
        ))}
      </Overlay>
    </HeaderLayer>
  )
}
