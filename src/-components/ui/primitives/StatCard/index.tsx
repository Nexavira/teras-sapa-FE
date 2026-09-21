import type { HTMLAttributes, ReactNode } from 'react'

import styled from '@emotion/styled'

import { theme } from '../../theme'
import { Card } from '../Card'
import { Typography } from '../Typography'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  label: string
  value: ReactNode
  subtext?: string
  color?: string
}

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
`

const StatIconWrapper = styled.div<{ $color: string }>`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $color }) => `${$color}14`};
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const StatCard = ({
  icon,
  label,
  value,
  subtext,
  color = theme.colors.primary.DEFAULT,
  ...props
}: StatCardProps) => {
  return (
    <StyledCard {...props}>
      {icon && <StatIconWrapper $color={color}>{icon}</StatIconWrapper>}
      <StatContent>
        <Typography variant="caption" color="secondary">
          {label}
        </Typography>
        <Typography
          variant="title"
          style={{ fontSize: '1.4rem', fontWeight: 700 }}
        >
          {value}
        </Typography>
        {subtext && (
          <Typography
            variant="caption"
            color="muted"
            style={{ fontSize: '0.75rem' }}
          >
            {subtext}
          </Typography>
        )}
      </StatContent>
    </StyledCard>
  )
}
