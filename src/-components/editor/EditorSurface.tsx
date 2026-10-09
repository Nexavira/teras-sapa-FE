import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { SpacingValue } from '#themes'

export const EditorSurface = styled.div<{
  $isSelected?: boolean
  $padding?: SpacingValue
}>`
  position: relative;
  min-width: 0;
  min-height: 24px;
  cursor: pointer;

  ${({ $padding }) =>
    $padding &&
    `
    padding: ${$padding.top || 0}px ${$padding.right || 0}px ${$padding.bottom || 0}px ${$padding.left || 0}px;
  `}
`

export const EditorSurfaceBadge = styled.div<{ $isSelected?: boolean }>`
  display: none;
`

export const blockEditorSurfaceStyles = css`
  [data-editor-surface='true'][data-block-id] {
    position: relative;
    cursor: pointer;
  }
`
