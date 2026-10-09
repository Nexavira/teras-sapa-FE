import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import styled from '@emotion/styled'
import { Layers01Icon } from 'hugeicons-react'

import type {
  ItemHoveredMessage,
  PreviewSelectedItem,
} from '#/lib/editor/previewBridge'

export interface EditorHoverOverlayProps {
  hoveredItem: ItemHoveredMessage['payload']
  selectedItem?: PreviewSelectedItem | null
}

interface ItemTarget {
  type: 'section' | 'block'
  id: string
  sectionId?: string
  parentBlockId?: string
}

interface BoundingBoxState {
  top: number
  left: number
  width: number
  height: number
  label: string
  isBlock: boolean
}

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;
  overflow: hidden;
`

const SelectedBoundingBox = styled.div<{
  $top: number
  $left: number
  $width: number
  $height: number
}>`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  box-sizing: border-box;
  pointer-events: none;

  /* Selected item bounding box on overlay layer */
  border: 2px solid #2563eb;
  box-shadow:
    0 0 0 1px rgba(37, 99, 235, 0.3),
    0 2px 8px rgba(37, 99, 235, 0.15);
  will-change: top, left, width, height;
`

const HoverBoundingBox = styled.div<{
  $top: number
  $left: number
  $width: number
  $height: number
}>`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  box-sizing: border-box;
  pointer-events: none;

  /* Hovered item bounding box on overlay layer */
  border: 1.5px solid #3b82f6;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.25),
    inset 0 0 0 1px rgba(59, 130, 246, 0.15);
  background-color: rgba(59, 130, 246, 0.035);
  will-change: top, left, width, height;
`

const BoundingBadge = styled.div<{
  $isTopClipped: boolean
  $isBlock: boolean
  $isSelected?: boolean
}>`
  position: absolute;
  ${({ $isTopClipped }) =>
    $isTopClipped
      ? `
    top: 2px;
    left: 2px;
    border-radius: 4px;
  `
      : `
    bottom: calc(100% + 4px);
    left: 0;
    border-radius: 4px;
  `}
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 8px;
  background-color: ${({ $isSelected, $isBlock }) =>
    $isSelected ? '#2563eb' : $isBlock ? '#0f172a' : '#1d4ed8'};
  color: #ffffff;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.02em;
  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.24),
    0 0 0 1px rgba(255, 255, 255, 0.12);
  pointer-events: none;
  user-select: none;
`

const DimensionText = styled.span`
  opacity: 0.65;
  font-size: 10px;
  font-weight: 500;
  margin-left: 2px;
`

function findTargetElement(item: ItemTarget | null): HTMLElement | null {
  if (!item || !item.id) return null

  if (item.type === 'block') {
    if (item.sectionId) {
      const match = document.querySelector<HTMLElement>(
        `[data-section-id="${item.sectionId}"][data-block-id="${item.id}"]`,
      )
      if (match) return match
    }

    const byId = document.getElementById(`teras-sapa-block-${item.id}`)
    if (byId) return byId

    return document.querySelector<HTMLElement>(`[data-block-id="${item.id}"]`)
  }

  const byId = document.getElementById(`teras-sapa-section-${item.id}`)
  if (byId) return byId

  return document.querySelector<HTMLElement>(`[data-section-id="${item.id}"]`)
}

function calculateBounds(
  el: HTMLElement | null,
  item: ItemTarget | null,
): BoundingBoxState | null {
  if (!el || !item) return null

  const rect = el.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null

  const computed = window.getComputedStyle(el)
  const isBlock = item.type === 'block'
  const label = isBlock
    ? el.getAttribute('data-block-label') ||
      el.getAttribute('data-block-type') ||
      item.id
    : el.getAttribute('data-section-name') ||
      el.getAttribute('data-section-type') ||
      item.id

  return {
    top: Math.round(rect.top),
    left: Math.round(rect.left),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    label,
    isBlock,
  }
}

export const EditorHoverOverlay: FC<EditorHoverOverlayProps> = ({
  hoveredItem,
  selectedItem,
}) => {
  const [hoverBox, setHoverBox] = useState<BoundingBoxState | null>(null)
  const [selectedBox, setSelectedBox] = useState<BoundingBoxState | null>(null)

  const hoveredTarget: ItemTarget | null = hoveredItem
    ? {
        type: hoveredItem.type,
        id: hoveredItem.id,
        sectionId: hoveredItem.sectionId,
        parentBlockId: hoveredItem.parentBlockId,
      }
    : null

  const selectedTarget: ItemTarget | null =
    selectedItem &&
    selectedItem.type !== 'global_settings_category' &&
    selectedItem.id
      ? {
          type: selectedItem.type,
          id: selectedItem.id,
          sectionId: selectedItem.sectionId,
          parentBlockId: selectedItem.parentBlockId,
        }
      : null

  const hoverElRef = useRef<HTMLElement | null>(null)
  const selectedElRef = useRef<HTMLElement | null>(null)

  const isHoverSameAsSelected = Boolean(
    hoveredTarget &&
    selectedTarget &&
    hoveredTarget.type === selectedTarget.type &&
    hoveredTarget.id === selectedTarget.id,
  )

  const updateAllBounds = useCallback(() => {
    // 1. Update selected box
    if (selectedTarget) {
      const el = selectedElRef.current || findTargetElement(selectedTarget)
      selectedElRef.current = el
      const nextSelected = calculateBounds(el, selectedTarget)
      setSelectedBox((prev) => {
        if (
          !prev ||
          !nextSelected ||
          prev.top !== nextSelected.top ||
          prev.left !== nextSelected.left ||
          prev.width !== nextSelected.width ||
          prev.height !== nextSelected.height ||
          prev.label !== nextSelected.label
        ) {
          return nextSelected
        }
        return prev
      })
    } else {
      selectedElRef.current = null
      setSelectedBox(null)
    }

    // 2. Update hovered box (only if distinct from selected)
    if (hoveredTarget && !isHoverSameAsSelected) {
      const el = hoverElRef.current || findTargetElement(hoveredTarget)
      hoverElRef.current = el
      const nextHover = calculateBounds(el, hoveredTarget)
      setHoverBox((prev) => {
        if (
          !prev ||
          !nextHover ||
          prev.top !== nextHover.top ||
          prev.left !== nextHover.left ||
          prev.width !== nextHover.width ||
          prev.height !== nextHover.height ||
          prev.label !== nextHover.label
        ) {
          return nextHover
        }
        return prev
      })
    } else {
      hoverElRef.current = null
      setHoverBox(null)
    }
  }, [hoveredTarget, isHoverSameAsSelected, selectedTarget])

  useEffect(() => {
    hoverElRef.current = findTargetElement(hoveredTarget)
    selectedElRef.current = findTargetElement(selectedTarget)
    updateAllBounds()

    const handleScrollOrResize = () => {
      updateAllBounds()
    }

    window.addEventListener('scroll', handleScrollOrResize, {
      capture: true,
      passive: true,
    })
    window.addEventListener('resize', handleScrollOrResize, { passive: true })

    let animId: number
    const loop = () => {
      updateAllBounds()
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, {
        capture: true,
      })
      window.removeEventListener('resize', handleScrollOrResize)
      cancelAnimationFrame(animId)
    }
  }, [hoveredTarget, selectedTarget, updateAllBounds])

  if (!hoverBox && !selectedBox) return null

  return (
    <OverlayContainer data-editor-overlay="true">
      {/* 1. Selected Bounding Box (Different Layer) */}
      {selectedBox && (
        <SelectedBoundingBox
          $top={selectedBox.top}
          $left={selectedBox.left}
          $width={selectedBox.width}
          $height={selectedBox.height}
          data-editor-selected-bounding-box="true"
        >
          <BoundingBadge
            $isTopClipped={selectedBox.top < 26}
            $isBlock={selectedBox.isBlock}
            $isSelected={true}
            data-editor-selected-badge="true"
          >
            {selectedBox.isBlock ? (
              <span aria-hidden="true" style={{ fontSize: '12px' }}>
                ⊞
              </span>
            ) : (
              <Layers01Icon aria-hidden="true" size={12} />
            )}
            <span>{selectedBox.label}</span>
            <DimensionText>
              {selectedBox.width} × {selectedBox.height}
            </DimensionText>
          </BoundingBadge>
        </SelectedBoundingBox>
      )}

      {/* 2. Hovered Bounding Box (Different Layer) */}
      {hoverBox && (
        <HoverBoundingBox
          $top={hoverBox.top}
          $left={hoverBox.left}
          $width={hoverBox.width}
          $height={hoverBox.height}
          data-editor-bounding-box="true"
        >
          <BoundingBadge
            $isTopClipped={hoverBox.top < 26}
            $isBlock={hoverBox.isBlock}
            $isSelected={false}
            data-editor-bounding-badge="true"
          >
            {hoverBox.isBlock ? (
              <span aria-hidden="true" style={{ fontSize: '12px' }}>
                ⊞
              </span>
            ) : (
              <Layers01Icon aria-hidden="true" size={12} />
            )}
            <span>{hoverBox.label}</span>
            <DimensionText>
              {hoverBox.width} × {hoverBox.height}
            </DimensionText>
          </BoundingBadge>
        </HoverBoundingBox>
      )}
    </OverlayContainer>
  )
}
