import React, { useRef } from 'react'

import { Layers01Icon } from 'hugeicons-react'

import {
  EditorSurface as StyledEditorSectionBox,
  EditorSurfaceBadge as SectionBadge,
} from '#/-components/editor/EditorSurface'
import type { ItemHoveredMessage } from '#/lib/editor/previewBridge'

import type { SpacingValue } from '#themes'

interface SectionWrapperProps {
  id: string
  sectionType: string
  sectionName: string
  isSelected: boolean
  isEditor: boolean
  padding?: SpacingValue
  children: React.ReactNode
  onSelect?: (id: string, blockId?: string, parentBlockId?: string) => void
  onHover?: (item: ItemHoveredMessage['payload']) => void
}

export const PreviewSectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  sectionType,
  sectionName,
  isSelected,
  isEditor,
  padding,
  children,
  onSelect,
  onHover,
}) => {
  const hoveredItem = useRef<string | null>(null)

  if (!isEditor) {
    if (padding) {
      return (
        <div
          id={`teras-sapa-section-${id}`}
          data-section-id={id}
          data-section-type={sectionType}
          style={{
            paddingTop: `${padding.top || 0}px`,
            paddingRight: `${padding.right || 0}px`,
            paddingBottom: `${padding.bottom || 0}px`,
            paddingLeft: `${padding.left || 0}px`,
          }}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        id={`teras-sapa-section-${id}`}
        data-section-id={id}
        data-section-type={sectionType}
      >
        {children}
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    // Prevent links or buttons inside the storefront from triggering real navigation
    e.preventDefault()
    e.stopPropagation()

    // 1. Check if the clicked target (or any ancestor) is a child block
    const target = e.target as HTMLElement
    const blockEl = target.closest('[data-block-id]')

    if (blockEl) {
      const blockId = blockEl.getAttribute('data-block-id')
      const sectionIdFromBlock = blockEl.getAttribute('data-section-id') || id
      const parentBlockId =
        blockEl.getAttribute('data-parent-block-id') || undefined

      if (blockId) {
        onSelect?.(sectionIdFromBlock, blockId, parentBlockId)
        return
      }
    }

    // 2. Otherwise select the parent section
    onSelect?.(id)
  }

  return (
    <StyledEditorSectionBox
      id={`teras-sapa-section-${id}`}
      data-section-id={id}
      data-section-type={sectionType}
      data-editor-surface="true"
      data-selected={isSelected}
      tabIndex={0}
      $isSelected={isSelected}
      $padding={padding}
      onClickCapture={handleClick}
      aria-label={`Edit ${sectionName || sectionType}`}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        event.stopPropagation()
        ;(event.target as HTMLElement).click()
      }}
      onMouseOver={(event) => {
        const block = (event.target as Element).closest('[data-block-id]')
        const blockId = block?.getAttribute('data-block-id')
        const item: ItemHoveredMessage['payload'] = blockId
          ? {
              type: 'block',
              id: blockId,
              sectionId: id,
              parentBlockId:
                block?.getAttribute('data-parent-block-id') || undefined,
            }
          : { type: 'section', id }
        const key = JSON.stringify(item)
        if (hoveredItem.current !== key) {
          hoveredItem.current = key
          onHover?.(item)
        }
      }}
      onMouseLeave={() => {
        hoveredItem.current = null
        onHover?.(null)
      }}
    >
      <SectionBadge data-editor-badge $isSelected={isSelected}>
        <Layers01Icon aria-hidden="true" size={12} />
        {sectionName || sectionType}
      </SectionBadge>
      {children}
    </StyledEditorSectionBox>
  )
}
