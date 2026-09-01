import type { MouseEvent, ReactNode } from 'react'
import { useId, useState } from 'react'

import type { LinkProps } from '@tanstack/react-router'
import { useRouterState } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import { Button } from '#/components/ui/primitives/Button'

import { adminTheme } from '../adminTheme'
import { NavLink } from './NavLink'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChevronIcon = styled(ArrowDown01Icon)<{ $isOpen: boolean }>`
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  flex-shrink: 0;
`

const SubNavList = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  padding-top: ${({ $isOpen }) => ($isOpen ? '2px' : '0')};
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition:
    max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.2s ease,
    padding-top 0.2s ease;
`

export interface SubNavItem {
  label: string
  to: string
  activeOptions?: LinkProps['activeOptions']
}

export interface CollapsibleNavItemProps {
  icon?: ReactNode
  label: ReactNode
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
  items,
  children,
  defaultOpen = true,
  isOpen: controlledIsOpen,
  onToggle,
  className,
}: CollapsibleNavItemProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  const contentId = useId()
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const pathname = useRouterState().location.pathname

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
      <Button
        variant={isChildActive ? 'ghost' : 'text'}
        color={isChildActive ? 'primary' : 'neutral'}
        size="sm"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        css={{
          textAlign: 'start',
        }}
        startIcon={icon}
        endIcon={<ChevronIcon size={14} $isOpen={isOpen} />}
      >
        <NavLabel data-nav-label>{label}</NavLabel>
      </Button>

      <SubNavList
        id={contentId}
        $isOpen={isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {items?.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            activeOptions={item.activeOptions}
            css={{
              position: 'relative',
              marginLeft: '32px',

              '&::before': {
                content: '""',
                position: 'absolute',
                left: '-12px',
                top: index === 0 ? '-4px' : '-80%',
                width: '12px',
                height: index === 0 ? 'calc(50% + 4px)' : '130%',
                boxSizing: 'border-box',
                borderLeft: `1px solid ${adminTheme.border}`,
                borderBottom: `1px solid ${adminTheme.border}`,
                borderBottomLeftRadius: '8px',
                pointerEvents: 'none',
              },
            }}
          >
            {item.label}
          </NavLink>
        ))}
        {children}
      </SubNavList>
    </Container>
  )
}
