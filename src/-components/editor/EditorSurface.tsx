import styled from '@emotion/styled'

import type { SpacingValue } from '#themes/types/theme'

export const EditorSurface = styled.div<{
  $isSelected: boolean
  $padding?: SpacingValue
}>`
  position: relative;
  min-width: 0;
  min-height: 24px;
  cursor: pointer;
  isolation: isolate;

  /* Paint editor feedback above positioned theme content and image overlays. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 100;
    pointer-events: none;
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition:
      outline-color 160ms ease,
      box-shadow 160ms ease;
  }

  ${({ $padding }) =>
    $padding &&
    `
    padding: ${$padding.top || 0}px ${$padding.right || 0}px ${$padding.bottom || 0}px ${$padding.left || 0}px;
  `}

  &:where(:hover, :focus-visible)::after {
    outline-color: #60a5fa;
    box-shadow: inset 0 0 0 4px rgb(59 130 246 / 10%);
  }

  &[data-selected='true']::after {
    outline-color: #2563eb;
    box-shadow: inset 0 0 0 4px rgb(37 99 235 / 14%);
  }

  &:active::after {
    outline-color: #1d4ed8;
    box-shadow: inset 0 0 0 5px rgb(37 99 235 / 24%);
  }

  &:hover:not(:has([data-editor-surface]:hover)) > [data-editor-badge],
  &:focus-visible > [data-editor-badge],
  &[data-selected='true'] > [data-editor-badge] {
    opacity: 1;
    transform: translateY(0);
  }

  &:has([data-editor-surface]:hover) > [data-editor-badge] {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after,
    & > [data-editor-badge] {
      transition: none;
    }
  }
`

export const EditorSurfaceBadge = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 101;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: calc(100% - 4px);
  overflow: hidden;
  white-space: nowrap;
  padding: 4px 8px;
  border-radius: 0 0 6px 0;
  background: ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#0f172a')};
  color: #fff;
  font:
    600 11px/1.4 system-ui,
    sans-serif;
  box-shadow: 0 2px 8px rgb(15 23 42 / 18%);
  pointer-events: none;
  opacity: 0;
  transform: translateY(-2px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
`
