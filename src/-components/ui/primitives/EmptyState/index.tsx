import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'
import { Typography } from '../Typography'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
  color: ${theme.colors.muted};

  svg {
    opacity: 0.45;
  }
`

const ActionContainer = styled.div`
  margin-top: 8px;
`

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <EmptyStateWrapper className={className}>
      {icon}
      <Typography
        variant="title"
        style={{ fontSize: '1.1rem', fontWeight: 700 }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color="secondary"
          style={{ maxWidth: 360 }}
        >
          {description}
        </Typography>
      )}
      {action && <ActionContainer>{action}</ActionContainer>}
    </EmptyStateWrapper>
  )
}
