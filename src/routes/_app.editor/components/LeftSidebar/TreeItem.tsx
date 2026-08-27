import React from 'react'

import styled from '@emotion/styled'

import { theme } from '#/components/ui/theme'

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

export const ItemRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  background-color: ${({ $active }) =>
    $active ? 'rgba(255, 90, 95, 0.08)' : 'transparent'};
  color: ${({ $active }) => ($active ? theme.colors.primary : '#222222')};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? 'rgba(255, 90, 95, 0.12)' : '#f7f7f7'};
    color: ${({ $active }) => ($active ? theme.colors.primary : '#000000')};
  }
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

  ${ItemRow}:hover & {
    opacity: 1;
  }
`

export const ActionBtn = styled.button<{ danger?: boolean }>`
  background: none;
  border: none;
  padding: 3px;
  border-radius: 4px;
  color: ${({ danger }) => (danger ? theme.colors.error : '#717171')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;

  &:hover {
    background-color: ${({ danger }) =>
      danger ? 'rgba(193, 53, 21, 0.1)' : '#ebebeb'};
    color: ${({ danger }) => (danger ? theme.colors.error : '#222222')};
  }
`

export const SubBlockRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 28px;
  font-size: 12px;
  color: ${({ $active }) => ($active ? theme.colors.primary : '#717171')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background-color: ${({ $active }) =>
    $active ? 'rgba(255, 90, 95, 0.06)' : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? 'rgba(255, 90, 95, 0.1)' : '#f7f7f7'};
    color: #222222;
  }
`

export const AddSectionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.primary};
  background-color: rgba(255, 90, 95, 0.05);
  border: 1px dashed rgba(255, 90, 95, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgba(255, 90, 95, 0.1);
    border-color: ${theme.colors.primary};
  }
`

export interface TreeItemProps {
  active?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  onClick?: () => void
}

export const TreeItem = ({
  active = false,
  icon,
  children,
  actions,
  onClick,
}: TreeItemProps) => {
  return (
    <ItemRow $active={active} onClick={onClick}>
      <ItemLeft>
        {icon}
        <span>{children}</span>
      </ItemLeft>
      {actions && <ItemActions>{actions}</ItemActions>}
    </ItemRow>
  )
}

export interface SubBlockItemProps {
  active?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export const SubBlockItem = ({
  active = false,
  children,
  onClick,
}: SubBlockItemProps) => {
  return (
    <SubBlockRow $active={active} onClick={onClick}>
      <span>🧱</span>
      <span>{children}</span>
    </SubBlockRow>
  )
}
