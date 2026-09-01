import type { ReactNode } from 'react'

import type { LinkProps } from '@tanstack/react-router'

import type { SubNavItem } from './CollapsibleNavItem'
import { CollapsibleNavItem } from './CollapsibleNavItem'
import { NavLink } from './NavLink'

export interface NavItemProps {
  to?: string
  icon?: ReactNode
  children: ReactNode
  items?: SubNavItem[]
  defaultOpen?: boolean
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  activeOptions?: LinkProps['activeOptions']
  className?: string
  onClick?: () => void
}

export const NavItem = ({
  to,
  icon,
  children,
  items,
  defaultOpen,
  isOpen,
  onToggle,
  activeOptions,
  className,
  onClick,
}: NavItemProps) => {
  if (items) {
    return (
      <CollapsibleNavItem
        icon={icon}
        label={children}
        items={items}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        onToggle={onToggle}
        className={className}
      />
    )
  }

  if (!to) {
    return null
  }

  return (
    <NavLink
      to={to}
      icon={icon}
      activeOptions={activeOptions}
      className={className}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}
