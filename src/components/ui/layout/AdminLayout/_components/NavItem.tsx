import type { ReactNode } from 'react'

import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'

import { theme } from '#/components/ui/theme'

const StyledNavLink = styled(Link)`
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

  &:hover {
    background-color: ${theme.colors.muted};
    color: #222222;
  }

  &.active {
    background-color: #fff0f1;
    color: ${theme.colors.primary};
    font-weight: 700;
  }
`

const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export interface NavItemProps {
  to: string
  icon?: ReactNode
  children: ReactNode
  activeOptions?: LinkProps['activeOptions']
  className?: string
  onClick?: () => void
}

export const NavItem = ({
  to,
  icon,
  children,
  activeOptions,
  className,
  onClick,
}: NavItemProps) => {
  return (
    <StyledNavLink
      to={to}
      activeOptions={activeOptions}
      className={className}
      onClick={onClick}
    >
      {icon}
      <NavLabel>{children}</NavLabel>
    </StyledNavLink>
  )
}
