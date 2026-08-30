import type { MouseEvent, ReactNode } from 'react'
import { useState } from 'react'

import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import { IconButton } from '#/components/ui/primitives/IconButton'
import { theme } from '#/components/ui/theme'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const HeaderButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '500')};
  color: ${({ $isActive }) => ($isActive ? theme.colors.primary.DEFAULT : '#484848')};
  background-color: ${({ $isActive }) => ($isActive ? '#fff0f1' : 'transparent')};
  border: none;
  width: 100%;
  text-align: left;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ $isActive }) => ($isActive ? '#fff0f1' : theme.colors.muted)};
    color: ${({ $isActive }) => ($isActive ? theme.colors.primary.DEFAULT : '#222222')};
  }
`

const HeaderLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #484848;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: ${theme.colors.muted};
    color: #222222;
  }

  &.active {
    background-color: #fff0f1;
    color: ${theme.colors.primary.DEFAULT};
    font-weight: 700;
  }
`

const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChevronIcon = styled(ArrowDown01Icon)<{ $isOpen: boolean }>`
  color: #717171;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  flex-shrink: 0;
`

const SubNavList = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition:
    max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease;
`

const SubNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px 6px 32px;
  border-radius: 8px;
  font-size: 0.785rem;
  font-weight: 500;
  color: #717171;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.muted};
    color: #222222;
  }

  &.active {
    background-color: #fff0f1;
    color: ${theme.colors.primary.DEFAULT};
    font-weight: 600;
  }
`

export interface SubNavItem {
  label: string
  to: string
  activeOptions?: LinkProps['activeOptions']
}

export interface CollapsibleNavItemProps {
  icon?: ReactNode
  label: ReactNode
  to?: string
  items?: SubNavItem[]
  children?: ReactNode
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  className?: string
}

export const CollapsibleNavItem = ({
  icon,
  label,
  to,
  items,
  children,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: CollapsibleNavItemProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const pathname = useRouterState({
    select: (state: any) => state.location.pathname,
  })

  const isChildActive = items?.some((item) => {
    if (item.activeOptions?.exact) {
      return pathname === item.to
    }
    return pathname.startsWith(item.to)
  })

  const handleToggle = (e?: MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    const nextOpen = !isOpen
    if (!isControlled) {
      setInternalIsOpen(nextOpen)
    }
    onToggle?.(nextOpen)
  }

  return (
    <Container className={className}>
      {to ? (
        <HeaderRow>
          <HeaderLink to={to}>
            {icon}
            <NavLabel>{label}</NavLabel>
          </HeaderLink>
          <IconButton
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleToggle}
            aria-expanded={isOpen}
            title={isOpen ? 'Collapse section' : 'Expand section'}
          >
            <ChevronIcon size={14} $isOpen={isOpen} />
          </IconButton>
        </HeaderRow>
      ) : (
        <HeaderButton
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          $isActive={isChildActive}
        >
          {icon}
          <NavLabel>{label}</NavLabel>
          <ChevronIcon size={14} $isOpen={isOpen} />
        </HeaderButton>
      )}

      <SubNavList $isOpen={isOpen}>
        {items?.map((item) => (
          <SubNavLink
            key={item.to}
            to={item.to}
            activeOptions={item.activeOptions}
          >
            {item.label}
          </SubNavLink>
        ))}
        {children}
      </SubNavList>
    </Container>
  )
}
