import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { Button, theme } from '#/components/ui'

const ItemRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

export const ItemRow = styled(Button)`
  min-width: 0;
  flex: 1;
  justify-content: flex-start;
  text-align: left;
`

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${ItemRowContainer}:hover &,
  &:focus-within {
    opacity: 1;
  }
`

export interface TreeItemProps {
  active?: boolean
  icon?: ReactNode
  children: ReactNode
  startAction?: ReactNode
  actions?: ReactNode
  onClick?: () => void
}

export const TreeItem = ({
  active = false,
  icon,
  children,
  startAction,
  actions,
  onClick,
}: TreeItemProps) => {
  return (
    <ItemRowContainer>
      {startAction}
      <ItemRow
        color={active ? 'primary' : 'neutral'}
        onClick={onClick}
        size="sm"
        type="button"
        variant={active ? 'solid' : 'ghost'}
      >
        <ItemLeft>
          {icon}
          <span>{children}</span>
        </ItemLeft>
      </ItemRow>
      {actions && <ItemActions>{actions}</ItemActions>}
    </ItemRowContainer>
  )
}
