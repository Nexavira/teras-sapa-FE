import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/shared/types/theme'

export interface AccentRulerBlockSettings {
  tag?: string
  show_bar?: boolean
  show_tag?: boolean
}

const RulerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: clamp(28px, 3.5vw, 40px);
  max-width: 460px;
  width: 100%;
  color: inherit;

  .accent-bar {
    width: 44px;
    height: 2px;
    background: var(--forge-orange);
    flex-shrink: 0;
    border-radius: 1px;
  }

  .accent-line {
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.16;
  }

  .accent-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.55;
    font-family: var(--forge-heading);
    flex-shrink: 0;
  }
`

export const AccentRulerBlock: React.FC<
  BlockComponentProps<AccentRulerBlockSettings>
> = ({ settings, ...restProps }) => {
  const { tag = 'PHILOSOPHY', show_bar = true, show_tag = true } = settings

  return (
    <RulerWrapper {...restProps}>
      {show_bar && <div className="accent-bar" />}
      <div className="accent-line" />
      {show_tag && tag && <div className="accent-tag">{tag}</div>}
    </RulerWrapper>
  )
}
