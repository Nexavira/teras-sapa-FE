import React from 'react'

import styled from '@emotion/styled'

import { Button, theme } from '#/components/ui'

export const TreeGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const TreeGroupHeader = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #717171;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export interface TreeGroupProps {
  title: string
  children: React.ReactNode
}

export const TreeGroup = ({ title, children }: TreeGroupProps) => {
  return (
    <TreeGroupContainer>
      <TreeGroupHeader>{title}</TreeGroupHeader>
      {children}
    </TreeGroupContainer>
  )
}

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

const SubBlockRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-left: ${theme.spacing.lg};
`

export const SubBlockRow = styled(Button)`
  min-width: 0;
  flex: 1;
  justify-content: flex-start;
  text-align: left;
`

const SubBlockLabel = styled.span`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 7px;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const SubBlockActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 1px;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${SubBlockRowContainer}:hover &,
  &:focus-within {
    opacity: 1;
  }
`

export interface TreeItemProps {
  active?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  startAction?: React.ReactNode
  actions?: React.ReactNode
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

export interface SubBlockItemProps {
  active?: boolean
  children: React.ReactNode
  icon?: React.ReactNode
  startAction?: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
}

export const SubBlockItem = ({
  active = false,
  children,
  icon,
  startAction,
  actions,
  onClick,
}: SubBlockItemProps) => {
  return (
    <SubBlockRowContainer>
      {startAction}
      <SubBlockRow
        color={active ? 'primary' : 'neutral'}
        onClick={onClick}
        size="sm"
        type="button"
        variant={active ? 'solid' : 'ghost'}
      >
        <SubBlockLabel>
          {icon}
          <span>{children}</span>
        </SubBlockLabel>
      </SubBlockRow>
      {actions && <SubBlockActions>{actions}</SubBlockActions>}
    </SubBlockRowContainer>
  )
}
