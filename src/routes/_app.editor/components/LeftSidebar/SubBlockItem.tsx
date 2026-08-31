import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { Button, theme } from '#/components/ui'

const SubBlockRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-left: ${theme.spacing.lg};
`

const SubBlockRow = styled(Button)`
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
