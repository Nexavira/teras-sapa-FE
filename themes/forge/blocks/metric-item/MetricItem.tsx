import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface MetricItemSettings {
  stat?: string
  label?: string
  accent?: boolean
}

const Shell = styled.div`
  padding: 6px;
  border-radius: 26px;
  background: rgba(23, 25, 21, 0.06);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.045);
  height: 100%;
  box-sizing: border-box;
`

const Card = styled.div<{ accent?: boolean }>`
  min-height: 210px;
  height: 100%;
  padding: 27px;
  border-radius: 21px;
  background: ${({ accent }) =>
    accent ? 'var(--forge-orange)' : 'var(--forge-paper)'};
  color: var(--forge-ink);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  strong {
    font: 540 clamp(54px, 7vw, 94px) / 0.9 var(--forge-heading);
    letter-spacing: -0.07em;
  }

  span {
    max-width: 220px;
    color: ${({ accent }) => (accent ? 'rgba(23, 25, 21, 0.7)' : '#676a63')};
    font-size: 12px;
    line-height: 1.4;
  }
`

export const MetricItem: React.FC<BlockComponentProps<MetricItemSettings>> = ({
  settings,
}) => {
  const {
    stat = '38',
    label = 'years of engineering craft',
    accent = false,
  } = settings

  return (
    <Shell>
      <Card accent={accent}>
        <strong>{stat}</strong>
        <span>{label}</span>
      </Card>
    </Shell>
  )
}
