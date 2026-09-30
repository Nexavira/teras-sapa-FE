import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface HeroMetaBlockSettings {
  eyebrow?: string
  meta?: string
}

const MetaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const Eyebrow = styled.span`
  display: inline-flex;
  padding: 6px 11px;
  border-radius: var(--forge-pill-radius, 32px);
  background: rgba(23, 25, 21, 0.06);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: inherit;
`

const MetaText = styled.span`
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.08em;
  color: rgba(var(--color-foreground), 0.6);
  text-transform: uppercase;
`

export const HeroMetaBlock: React.FC<
  BlockComponentProps<HeroMetaBlockSettings>
> = ({ settings, ...restProps }) => {
  const { eyebrow = 'Industrial / 01', meta = 'EST. 2026' } = settings

  return (
    <MetaContainer {...restProps}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {meta && <MetaText>{meta}</MetaText>}
    </MetaContainer>
  )
}
