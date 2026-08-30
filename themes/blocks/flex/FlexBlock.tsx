import type { CSSProperties } from 'react'
import React from 'react'

import styled from '@emotion/styled'

import type { BlockComponentProps } from '#themes/types/theme'

export interface FlexBlockSettings {
  direction?: CSSProperties['flexDirection']
  justify_content?: CSSProperties['justifyContent']
  align_items?: CSSProperties['alignItems']
  gap?: number
  wrap?: boolean
}

const FlexContainer = styled.div<Required<FlexBlockSettings>>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  justify-content: ${({ justify_content }) => justify_content};
  align-items: ${({ align_items }) => align_items};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  gap: ${({ gap }) => gap}px;
  min-width: 0;
`

export const FlexBlock: React.FC<BlockComponentProps<FlexBlockSettings>> = ({
  children,
  settings,
}) => {
  const {
    direction = 'row',
    justify_content = 'flex-start',
    align_items = 'stretch',
    gap = 16,
    wrap = true,
  } = settings

  return (
    <FlexContainer
      align_items={align_items}
      direction={direction}
      gap={gap}
      justify_content={justify_content}
      wrap={wrap}
    >
      {children}
    </FlexContainer>
  )
}
