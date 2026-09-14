import type { ReactNode } from 'react'

import styled from '@emotion/styled'
import { ArrowDown01Icon } from 'hugeicons-react'

import { Button, theme } from '#/-components/ui'

import { stopDndPropagation } from './editorDnd'

const ItemContainer = styled.div<{ $level?: number; $index?: number }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-left: ${({ $level = 0 }) => ($level > 0 ? `${$level * 20}px` : '0')};

  ${({ $level = 0, $index = 0 }) =>
    $level > 0 &&
    `
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: ${$index === 0 ? '-4px' : '-80%'};
      width: 12px;
      height: ${$index === 0 ? 'calc(50% + 4px)' : '130%'};
      box-sizing: border-box;
      border-left: 1px solid ${theme.colors.border};
      border-bottom: 1px solid ${theme.colors.border};
      border-bottom-left-radius: 8px;
      pointer-events: none;
    }
  `}
`

const NavButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  text-align: left;
`

const NavLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const EndActionsContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
`

const StartIconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

export const ItemActions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;

  [data-tree-item]:hover &,
  [data-tree-item]:focus-within & {
    opacity: 1;
  }
`

const StyledActionIconButton = styled('span', {
  shouldForwardProp: (prop) => prop !== '$variant',
})<{
  $variant?: 'default' | 'danger'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: ${({ $variant }) =>
    $variant === 'danger' ? theme.colors.error : theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'danger' ? '#fee2e2' : 'rgba(0, 0, 0, 0.08)'};
    color: ${({ $variant }) =>
      $variant === 'danger' ? theme.colors.error : theme.colors.text.primary};
  }
`

export interface ActionIconButtonProps extends React.ComponentPropsWithoutRef<'span'> {
  $variant?: 'default' | 'danger'
}

export const ActionIconButton = ({
  $variant,
  onClick,
  onPointerDown,
  onMouseDown,
  children,
  ...props
}: ActionIconButtonProps) => {
  return (
    <StyledActionIconButton
      ref={stopDndPropagation}
      role="button"
      tabIndex={0}
      data-action-button="action"
      data-no-dnd="true"
      $variant={$variant}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        onPointerDown?.(e)
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        onMouseDown?.(e)
      }}
      {...props}
    >
      {children}
    </StyledActionIconButton>
  )
}

const ChevronToggle = styled('span', {
  shouldForwardProp: (prop) => prop !== '$isOpen',
})<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: ${theme.colors.text.primary};
  }

  > svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(-90deg)')};
  }
`

export interface TreeItemProps {
  active?: boolean
  icon?: ReactNode
  children: ReactNode
  hasChildren?: boolean
  isOpen?: boolean
  onToggleOpen?: (e?: React.MouseEvent) => void
  actions?: ReactNode
  level?: number
  index?: number
  buttonRef?: (element: Element | null) => void
  onClick?: () => void
  className?: string
  startAction?: ReactNode
}

export const TreeItem = ({
  active = false,
  icon,
  children,
  hasChildren,
  isOpen,
  onToggleOpen,
  actions,
  level = 0,
  index = 0,
  buttonRef,
  onClick,
  className,
  startAction,
}: TreeItemProps) => {
  const showChevron = hasChildren ?? Boolean(startAction)
  const isExpanded = isOpen ?? true

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleOpen?.(e)
  }

  return (
    <ItemContainer
      data-tree-item
      $level={level}
      $index={index}
      className={className}
    >
      <NavButton
        ref={buttonRef}
        data-nav-item="true"
        variant={active ? 'ghost' : 'text'}
        color={active ? 'primary' : 'neutral'}
        size="sm"
        data-active={active}
        onClick={onClick}
        startIcon={
          showChevron ? (
            <StartIconContainer
              data-no-dnd="true"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ChevronToggle
                ref={stopDndPropagation}
                $isOpen={isExpanded}
                role="button"
                aria-expanded={isExpanded}
                data-action-button="chevron"
                data-no-dnd="true"
                onClick={handleChevronClick}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <ArrowDown01Icon size={14} />
              </ChevronToggle>
              {icon}
            </StartIconContainer>
          ) : (
            icon
          )
        }
        endIcon={
          actions ? (
            <EndActionsContainer
              data-action-button="actions"
              data-no-dnd="true"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <ItemActions>{actions}</ItemActions>
            </EndActionsContainer>
          ) : undefined
        }
      >
        <NavLabel data-nav-label>{children}</NavLabel>
      </NavButton>
    </ItemContainer>
  )
}
