import type { FC } from 'react'
import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface GridBlockSettings {
  columns?: number
  gap?: number
}

const GridContainer = styled.div<{
  columns: number
  gap: number
}>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columns }) => Math.max(1, Math.min(12, Number(columns) || 3))},
    minmax(0, 1fr)
  );
  gap: ${({ gap }) => gap}px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`

export const GridBlock: FC<BlockComponentProps<GridBlockSettings>> = ({
  children,
  settings,
  ...restProps
}) => {
  const { columns = 3, gap = 24 } = settings

  return (
    <GridContainer columns={columns} gap={gap} {...restProps}>
      {children}
    </GridContainer>
  )
}
