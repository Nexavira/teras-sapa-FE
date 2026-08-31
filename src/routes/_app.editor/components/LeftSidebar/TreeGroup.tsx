import type { ReactNode } from 'react'

import styled from '@emotion/styled'

const TreeGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TreeGroupHeader = styled.div`
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
  children: ReactNode
}

export const TreeGroup = ({ title, children }: TreeGroupProps) => (
  <TreeGroupContainer>
    <TreeGroupHeader>{title}</TreeGroupHeader>
    {children}
  </TreeGroupContainer>
)
