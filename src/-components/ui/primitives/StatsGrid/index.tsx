import type { HTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

export interface StatsGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
  children: ReactNode
}

const StyledStatsGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(
      ${({ $columns }) => ($columns >= 3 ? 2 : 1)},
      minmax(0, 1fr)
    );
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

export const StatsGrid = ({
  columns = 4,
  children,
  ...props
}: StatsGridProps) => {
  return (
    <StyledStatsGrid $columns={columns} {...props}>
      {children}
    </StyledStatsGrid>
  )
}
