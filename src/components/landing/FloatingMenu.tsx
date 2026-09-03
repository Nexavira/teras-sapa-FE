import { useEffect, useRef, useState } from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { ArrowUpRight01Icon, Cancel01Icon, Menu02Icon } from 'hugeicons-react'

import { landingColors } from './shared'

const menuItems = [
  { number: '01', label: 'Beranda', href: '#hero' },
  { number: '02', label: 'CMS', href: '#cms' },
  { number: '03', label: 'Platform', href: '#platform' },
  { number: '04', label: 'Pembayaran', href: '#payments' },
  { number: '05', label: 'Template', href: '#templates' },
  { number: '06', label: 'Pricing', href: '#pricing' },
  { number: '07', label: 'Mulai', href: '#cta' },
] as const

const FloatingRoot = styled.div`
  position: fixed;
  z-index: 100;
  top: 16px;
  right: clamp(16px, 2.5vw, 36px);
  width: min(420px, calc(100vw - 32px));
  font-family: Inter, ${({ theme }) => theme.typography.fontFamily};
`

const Backdrop = styled.button<{ $open: boolean }>`
  position: fixed;
  z-index: -1;
  inset: 0;
  border: 0;
  background: rgba(5, 5, 5, 0.3);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  backdrop-filter: blur(3px);
  transition: opacity 260ms ease;
`

const Panel = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${({ $open }) =>
    $open ? 'min(626px, calc(100svh - 32px))' : '64px'};
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(5, 5, 5, 0.92);
  color: ${landingColors.white};
  backdrop-filter: blur(18px);
  transition:
    height 520ms cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 420ms cubic-bezier(0.22, 1, 0.36, 1),
    background 260ms ease,
    box-shadow 260ms ease;
`

const PanelHeader = styled.div<{ $open: boolean }>`
  display: flex;
  flex: 0 0 64px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;
  border-bottom: 1px solid
    ${({ $open }) =>
      $open ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)'};
  transition: border-color 180ms ease;
`

const MenuBrand = styled.a`
  color: ${landingColors.white};
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.055em;

  span {
    color: ${landingColors.emerald};
  }
`

const MenuToggle = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  justify-content: center;
  min-width: 92px;
  height: 44px;
  padding: 0 15px;
  border: 1px solid
    ${({ $open }) =>
      $open ? landingColors.emerald : 'rgba(255, 255, 255, 0.14)'};
  border-radius: 999px;
  background: ${({ $open }) =>
    $open ? landingColors.emerald : 'rgba(255, 255, 255, 0.06)'};
  color: ${landingColors.white};
  font: inherit;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;

  &:hover {
    border-color: ${landingColors.emerald};
    background: ${landingColors.emerald};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${landingColors.emerald};
    outline-offset: 2px;
  }
`

const PanelContent = styled.div<{ $open: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transform: translateY(${({ $open }) => ($open ? '0' : '-10px')});
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition:
    opacity 220ms ${({ $open }) => ($open ? '140ms' : '0ms')} ease,
    transform 300ms ${({ $open }) => ($open ? '110ms' : '0ms')} ease,
    visibility 220ms ${({ $open }) => ($open ? '100ms' : '0ms')};
`

const Navigation = styled.nav`
  flex: 1;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;
`

const MenuLink = styled.a<{ $active: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  min-height: 58px;
  padding: 0 14px;
  overflow: hidden;
  border-radius: 12px;
  color: ${({ $active }) =>
    $active ? landingColors.white : 'rgba(255, 255, 255, 0.78)'};
  transition:
    color 180ms ease,
    background 180ms ease;

  &::before {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${({ $active }) =>
      $active ? 'rgba(0, 168, 107, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0.86)});
    transform-origin: left;
    transition:
      opacity 180ms ease,
      transform 240ms ease;
    content: '';
  }

  > * {
    position: relative;
  }

  &:hover {
    color: ${landingColors.white};
  }

  &:hover::before {
    opacity: 1;
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 2px solid ${landingColors.emerald};
    outline-offset: -2px;
  }

  svg {
    opacity: 0;
    transform: translate(-5px, 5px);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  &:hover svg,
  &[aria-current='true'] svg {
    opacity: 1;
    transform: translate(0, 0);
  }
`

const Number = styled.span`
  color: ${landingColors.emerald};
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
`

const Label = styled.span`
  font-size: clamp(1.15rem, 4vw, 1.4rem);
  font-weight: 500;
  letter-spacing: -0.035em;
`

const PanelFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 18px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex: 0 0 auto;

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.62rem;
    line-height: 1.5;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`

const RegisterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: ${landingColors.emerald};
  color: ${landingColors.white};
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    background 180ms ease,
    transform 180ms ease;

  &:hover {
    background: ${landingColors.emeraldDark};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${landingColors.white};
    outline-offset: 2px;
  }
`

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const sections = menuItems
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .at(0)

        if (visibleSection) setActiveSection(visibleSection.target.id)
      },
      { rootMargin: '-22% 0px -58%', threshold: [0, 0.2, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <FloatingRoot>
      <Backdrop
        $open={isOpen}
        type="button"
        aria-label="Tutup menu"
        tabIndex={-1}
        onClick={closeMenu}
      />

      <Panel $open={isOpen}>
        <PanelHeader $open={isOpen}>
          <MenuBrand href="#hero" onClick={closeMenu}>
            TERASSAPA<span>.</span>
          </MenuBrand>
          <MenuToggle
            ref={menuButtonRef}
            $open={isOpen}
            type="button"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isOpen}
            aria-controls="landing-menu"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? 'Tutup' : 'Menu'}
            {isOpen ? (
              <Cancel01Icon size={17} strokeWidth={1.8} />
            ) : (
              <Menu02Icon size={18} strokeWidth={1.8} />
            )}
          </MenuToggle>
        </PanelHeader>

        <PanelContent id="landing-menu" $open={isOpen} aria-hidden={!isOpen}>
          <Navigation aria-label="Navigasi halaman">
            {menuItems.map(({ number, label, href }) => {
              const isActive = activeSection === href.slice(1)

              return (
                <MenuLink
                  key={href}
                  href={href}
                  $active={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={closeMenu}
                >
                  <Number>{number}</Number>
                  <Label>{label}</Label>
                  <ArrowUpRight01Icon size={18} strokeWidth={1.6} />
                </MenuLink>
              )
            })}
          </Navigation>

          <PanelFooter>
            <p>Konten & commerce tanpa batas.</p>
            <RegisterLink to="/register" tabIndex={isOpen ? 0 : -1}>
              Coba gratis <ArrowUpRight01Icon size={15} strokeWidth={1.8} />
            </RegisterLink>
          </PanelFooter>
        </PanelContent>
      </Panel>
    </FloatingRoot>
  )
}
