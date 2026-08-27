import React from 'react'

import styled from '@emotion/styled'

import { PREVIEW_MESSAGE_TYPES } from '#/lib/editor/previewBridge'
import { editorActions, useEditorSelectedItem } from '#/store/editorStore'

import { BlockRegistry } from '#themes/registry'
import type { BlockInstance, SpacingValue } from '#themes/types/theme'

const EditorBlockWrapper = styled.div<{
  $isSelected: boolean
  $padding?: SpacingValue
}>`
  position: relative;
  transition:
    outline 0.15s ease,
    box-shadow 0.15s ease;
  outline: ${({ $isSelected }) =>
    $isSelected ? '2px solid #2563eb' : '1px dashed transparent'};
  outline-offset: 2px;
  cursor: pointer;
  display: block;
  z-index: ${({ $isSelected }) => ($isSelected ? 20 : 5)};

  ${({ $padding }) =>
    $padding
      ? `
    padding-top: ${$padding.top || 0}px;
    padding-right: ${$padding.right || 0}px;
    padding-bottom: ${$padding.bottom || 0}px;
    padding-left: ${$padding.left || 0}px;
  `
      : ''}

  &:hover {
    outline: ${({ $isSelected }) =>
      $isSelected ? '2px solid #2563eb' : '1px dashed #3b82f6'};
    outline-offset: 2px;
    z-index: 25;
  }
`

const BlockBadge = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: -12px;
  left: 10px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#0f172a')};
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  transition: opacity 0.15s ease;
  white-space: nowrap;

  ${EditorBlockWrapper}:hover & {
    opacity: 1;
  }
`

export interface BlockRendererProps {
  sectionId: string
  blockId: string
  block: BlockInstance
  isEditor?: boolean
  children?: React.ReactNode
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  sectionId,
  blockId,
  block,
  isEditor = false,
  children,
}) => {
  const selectedItem = useEditorSelectedItem()
  const registered = BlockRegistry[block.type]

  const isSelected =
    Boolean(isEditor) &&
    selectedItem?.type === 'block' &&
    selectedItem.id === blockId &&
    selectedItem.sectionId === sectionId

  let blockContent = children

  if (!blockContent) {
    const BlockComponent = registered.Component
    blockContent = (
      <BlockComponent
        id={blockId}
        settings={block.settings}
        isEditor={isEditor}
      />
    )
  }

  const blockPadding: SpacingValue | undefined = block.settings.padding

  if (!isEditor) {
    if (blockPadding) {
      return (
        <div
          data-block-id={blockId}
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
    }

    // Update local editor store in iframe
    editorActions.selectItem(payload)

    // Notify parent editor window
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: PREVIEW_MESSAGE_TYPES.ITEM_CLICKED,
          payload,
        },
        '*',
      )
    }
  }

  return (
    <EditorBlockWrapper
      id={`shopify-block-${blockId}`}
      data-block-id={blockId}
      data-section-id={sectionId}
      data-block-type={block.type}
      $isSelected={isSelected}
      $padding={blockPadding}
      onClick={handleBlockClick}
    >
      <BlockBadge $isSelected={isSelected}>
        <span>🧱</span> {blockName}
      </BlockBadge>
      {blockContent}
    </EditorBlockWrapper>
  )
}
