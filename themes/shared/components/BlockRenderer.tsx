import type { FC, MouseEvent, ReactNode } from 'react'

import { Layers01Icon } from 'hugeicons-react'

import {
  EditorSurface as EditorBlockWrapper,
  EditorSurfaceBadge as BlockBadge,
} from '#/-components/editor/EditorSurface'

import { useThemeEditor } from '../editor-context'
import type {
  BlockInstance,
  RegisteredBlock,
  SpacingValue,
} from '../types/theme'
import { ThemeErrorBoundary } from './ThemeErrorBoundary'
import { ThemeErrorCard } from './ThemeErrorCard'

export interface BlockRendererProps {
  sectionId: string
  blockId: string
  block?: BlockInstance
  isEditor?: boolean
  parentBlockId?: string
  children?: ReactNode
  blockRegistry?: Record<string, RegisteredBlock>
  defaultBlockRegistry?: Record<string, RegisteredBlock>
}

export const BlockRenderer: FC<BlockRendererProps> = ({
  sectionId,
  blockId,
  block,
  isEditor = false,
  parentBlockId,
  children,
  blockRegistry,
  defaultBlockRegistry,
}) => {
  const themeEditor = useThemeEditor()
  const selectedItem = themeEditor?.selectedItem

  const activeRegistry =
    blockRegistry || themeEditor?.blockRegistry || defaultBlockRegistry || {}

  const isSelected =
    Boolean(isEditor) &&
    selectedItem?.type === 'block' &&
    selectedItem.id === blockId &&
    selectedItem.sectionId === sectionId &&
    selectedItem.parentBlockId === parentBlockId

  const handleBlockClick = (e: MouseEvent) => {
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

  // 1. Guard against undefined block instance (e.g. ID in block_order but missing in blocks)
  if (!block) {
    const errorCard = (
      <ThemeErrorCard
        kind="block"
        id={blockId}
        sectionId={sectionId}
        parentBlockId={parentBlockId}
        title="Block Data Missing"
        message={`Block "${blockId}" is listed in block_order but is undefined in template blocks.`}
        isEditor={isEditor}
      />
    )

    if (!isEditor) return errorCard

    return (
      <EditorBlockWrapper
        id={`teras-sapa-block-${blockId}`}
        data-block-id={blockId}
        data-parent-block-id={parentBlockId}
        data-section-id={sectionId}
        data-editor-surface="true"
        data-selected={isSelected}
        tabIndex={0}
        $isSelected={isSelected}
        aria-label={`Missing block ${blockId}`}
        onClick={handleBlockClick}
      >
        <BlockBadge data-editor-badge $isSelected={isSelected}>
          <Layers01Icon aria-hidden="true" size={12} /> Missing: {blockId}
        </BlockBadge>
        {errorCard}
      </EditorBlockWrapper>
    )
  }

  // 2. Guard against unregistered block type
  const registered = activeRegistry[block.type]
  const isRegistered = Boolean(registered)
  if (!isRegistered) {
    const errorCard = (
      <ThemeErrorCard
        kind="block"
        id={blockId}
        type={block.type}
        sectionId={sectionId}
        parentBlockId={parentBlockId}
        title="Block Component Not Found"
        message={`Block type "${block.type}" is not registered in BlockRegistry. Check the theme's registry.ts or block definitions.`}
        isEditor={isEditor}
      />
    )

    if (!isEditor) return errorCard

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
        aria-label={`Unregistered block ${block.type}`}
        onClick={handleBlockClick}
      >
        <BlockBadge data-editor-badge $isSelected={isSelected}>
          <Layers01Icon aria-hidden="true" size={12} /> Unregistered:{' '}
          {block.type}
        </BlockBadge>
        {errorCard}
      </EditorBlockWrapper>
    )
  }

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
          blockRegistry={activeRegistry}
          defaultBlockRegistry={defaultBlockRegistry}
          isEditor={isEditor}
          key={childBlockId}
          parentBlockId={blockId}
          sectionId={sectionId}
        />
      )
    })

    blockContent = (
      <ThemeErrorBoundary
        kind="block"
        id={blockId}
        type={block.type}
        name={registered.schema.name}
        sectionId={sectionId}
        parentBlockId={parentBlockId}
        isEditor={isEditor}
      >
        <BlockComponent
          id={blockId}
          settings={block.settings}
          isEditor={isEditor}
        >
          {renderedChildren}
        </BlockComponent>
      </ThemeErrorBoundary>
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
