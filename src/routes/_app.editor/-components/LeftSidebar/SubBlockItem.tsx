import type { ReactNode } from 'react'

import { TreeItem } from './TreeItem'

export interface SubBlockItemProps {
  active?: boolean
  children: ReactNode
  icon?: ReactNode
  startAction?: ReactNode
  actions?: ReactNode
  onClick?: () => void
}

export const SubBlockItem = ({
  active = false,
  children,
  icon,
  startAction,
  actions,
  onClick,
}: SubBlockItemProps) => (
  <TreeItem
    active={active}
    icon={icon}
    startAction={startAction}
    actions={actions}
    onClick={onClick}
    level={1}
  >
    {children}
  </TreeItem>
)
