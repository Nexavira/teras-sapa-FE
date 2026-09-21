import React from 'react'

import { Layers01Icon } from 'hugeicons-react'

import {
  EditorSurface as EditorBlockWrapper,
  EditorSurfaceBadge as BlockBadge,
} from '#/-components/editor/EditorSurface'

import { BlockRegistry } from '#themes/dawn/registry'
import { useThemeEditor } from '#themes/shared/editor-context'
import type { BlockInstance, SpacingValue } from '#themes/shared/types/theme'

export interface BlockRendererProps {
  sectionId: string
  blockId: string
  block: BlockInstance
  isEditor?: boolean
  parentBlockId?: string
  children?: React.ReactNode
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  sectionId,
  blockId,
  block,
  isEditor = false,
  parentBlockId,
  children,
}) => {
  const themeEditor = useThemeEditor()
  const selectedItem = themeEditor?.selectedItem
  const registered = BlockRegistry[block.type]

  const isSelected =
    Boolean(isEditor) &&
    selectedItem?.type === 'block' &&
    selectedItem.id === blockId &&
    selectedItem.sectionId === sectionId &&
    selectedItem.parentBlockId === parentBlockId

  let blockContent = children

  if (blockContent === undefined) {
    const BlockComponent = registered.Component
    const childBlocks = block.blocks || {}
    const renderedChildren = (block.block_order || []).map((childBlockId) => {
      const childBlock = childBlocks[childBlockId]

      return (
        <BlockRenderer
          block={childBlock}
          blockId={childBlockId}
          isEditor={isEditor}
          key={childBlockId}
          parentBlockId={blockId}
          sectionId={sectionId}
        />
      )
    })

    blockContent = (
      <BlockComponent
        id={blockId}
        settings={block.settings}
        isEditor={isEditor}
      >
        {renderedChildren}
      </BlockComponent>
    )
  }

  const blockPadding: SpacingValue | undefined = block.settings.padding

  if (!isEditor) {
    if (blockPadding) {
      return (
        <div
          data-block-id={blockId}
          data-parent-block-id={parentBlockId}
          data-section-id={sectionId}
          data-block-type={block.type}
          style={{
            paddingTop: `${blockPadding.top || 0}px`,
            paddingRight: `${blockPadding.right || 0}px`,
            paddingBottom: `${blockPadding.bottom || 0}px`,
            paddingLeft: `${blockPadding.left || 0}px`,
          }}
        >
          {blockContent}
        </div>
      )
    }
    return (
      <div
        data-block-id={blockId}
        data-parent-block-id={parentBlockId}
        data-section-id={sectionId}
        data-block-type={block.type}
      >
        {blockContent}
      </div>
    )
  }

  const blockName = registered.schema.name || block.type

  const handleBlockClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const payload = {
      type: 'block' as const,
      id: blockId,
      sectionId,
      parentBlockId,
    }

    themeEditor?.selectBlock(payload)
  }

  return (
    <EditorBlockWrapper
      id={`teras-sapa-block-${blockId}`}
      data-block-id={blockId}
      data-parent-block-id={parentBlockId}
      data-section-id={sectionId}
      data-block-type={block.type}
      data-editor-surface="true"
      data-selected={isSelected}
      tabIndex={0}
      $isSelected={isSelected}
      $padding={blockPadding}
      aria-label={`Edit ${blockName}`}
      onClick={handleBlockClick}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === 'Enter' || event.key === ' ')
        ) {
          event.preventDefault()
          event.currentTarget.click()
        }
      }}
    >
      <BlockBadge data-editor-badge $isSelected={isSelected}>
        <Layers01Icon aria-hidden="true" size={12} /> {blockName}
      </BlockBadge>
      {blockContent}
    </EditorBlockWrapper>
  )
}
