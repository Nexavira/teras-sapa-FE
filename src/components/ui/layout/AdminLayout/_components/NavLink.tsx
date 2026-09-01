import type { ReactNode } from 'react'

import type { LinkProps } from '@tanstack/react-router'
import { Link, useRouterState } from '@tanstack/react-router'

import { Button } from '#/components/ui/primitives/Button'

export interface NavLinkProps {
  to: string
  icon?: ReactNode
  children: ReactNode
  activeOptions?: LinkProps['activeOptions']
  className?: string
  onClick?: () => void
}

export const NavLink = ({
  to,
  icon,
  children,
  activeOptions,
  className,
  onClick,
}: NavLinkProps) => {
  const pathname = useRouterState().location.pathname
  const isActive = activeOptions?.exact
    ? pathname === to
    : pathname.startsWith(to)

  return (
    <Link css={{ width: '100%' }} to={to} activeOptions={activeOptions}>
      <Button
        variant={isActive ? 'ghost' : 'text'}
        color={isActive ? 'primary' : 'neutral'}
        className={className}
        onClick={onClick}
        size="sm"
        data-active={isActive}
        css={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
      >
        {icon}
        <span
          data-nav-label
          css={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </span>
      </Button>
    </Link>
  )
}
