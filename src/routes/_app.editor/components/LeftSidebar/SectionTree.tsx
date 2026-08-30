import React, { useState } from 'react'

import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'
import styled from '@emotion/styled'
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  PlusSignIcon,
} from 'hugeicons-react'

import { Button } from '#/components/ui'
import { findBlockLocation, reorderItems } from '#/lib/editor/blockTree'
import {
  editorActions,
  useEditorSelectedItem,
  useEditorTemplate,
} from '#/store/editorStore'

import { AddBlockModal } from './AddBlockModal'
import { AddSectionModal } from './AddSectionModal'
import { EditorItemIcon } from './EditorItemIcon'
import { SubBlockItem, TreeGroup, TreeItem } from './TreeItem'
import { BlockRegistry, SectionRegistry } from '#themes/registry'
import type {
  BlockInstance,
  BlockSchema,
  SectionInstance,
  SectionSchema,
} from '#themes/types/theme'

const AddSectionButton = styled(Button)`
  width: 100%;
  margin-top: 6px;
`

const AddBlockButton = styled(Button)`
  width: calc(100% - 32px);
  margin: 3px 0 4px 32px;
  justify-content: flex-start;
`

const SortableEntry = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`

const NestedBlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

interface AddBlockTarget {
  sectionId: string
  parentBlockId?: string
}

interface BlockListProps {
  blocks: Record<string, BlockInstance>
  blockOrder: string[]
  onAddBlock: (parentBlockId?: string) => void
  parentBlockId?: string
  parentSchema: SectionSchema | BlockSchema
  sectionId: string
}

interface SortableBlockEntryProps {
  block: BlockInstance
  blockId: string
  blockSchema: BlockSchema
  index: number
  onAddBlock: (parentBlockId?: string) => void
  parentBlockId?: string
  sectionId: string
}

const SortableBlockEntry: React.FC<SortableBlockEntryProps> = ({
  block,
  blockId,
  blockSchema,
  index,
  onAddBlock,
  parentBlockId,
  sectionId,
}) => {
  const selectedItem = useEditorSelectedItem()
  const [isCollapsed, setCollapsed] = useState(false)
  const { handleRef, isDragging, ref } = useSortable({
    id: `block:${blockId}`,
    index,
    group: `blocks:${sectionId}:${parentBlockId || 'root'}`,
  })
  const blockOrder = block.block_order || []
  const hasChildren = blockOrder.length > 0
  const supportsChildren = Boolean(blockSchema.blocks?.length)

  return (
    <SortableEntry $isDragging={isDragging} ref={ref}>
      <SubBlockItem
        actions={
          <>
            <Button
              aria-label="Drag to reorder block"
              color="neutral"
              ref={handleRef}
              size="icon"
              startIcon={<DragDropVerticalIcon size={14} />}
              title="Drag to reorder block"
              type="button"
              variant="ghost"
            />
            <Button
              aria-label="Delete block"
              color="danger"
              onClick={() => editorActions.removeBlock(sectionId, blockId)}
              size="icon"
              startIcon={<Delete02Icon size={13} />}
              title="Delete block"
              type="button"
              variant="ghost"
            />
          </>
        }
        active={selectedItem?.type === 'block' && selectedItem.id === blockId}
        icon={<EditorItemIcon kind="block" size={14} type={block.type} />}
        onClick={() =>
          editorActions.selectItem({
            type: 'block',
            id: blockId,
            sectionId,
            parentBlockId,
          })
        }
        startAction={
          hasChildren ? (
            <Button
              aria-expanded={!isCollapsed}
              aria-label={
                isCollapsed ? 'Expand child blocks' : 'Collapse child blocks'
              }
              color="neutral"
              onClick={() => setCollapsed((collapsed) => !collapsed)}
              size="icon"
              startIcon={
                isCollapsed ? (
                  <ArrowRight01Icon size={13} />
                ) : (
                  <ArrowDown01Icon size={13} />
                )
              }
              type="button"
              variant="ghost"
            />
          ) : undefined
        }
      >
        {blockSchema.name || block.type}
      </SubBlockItem>

      {!isCollapsed && supportsChildren && (
        <BlockList
          blocks={block.blocks || {}}
          blockOrder={blockOrder}
          onAddBlock={onAddBlock}
          parentBlockId={blockId}
          parentSchema={blockSchema}
          sectionId={sectionId}
        />
      )}
    </SortableEntry>
  )
}

const BlockList: React.FC<BlockListProps> = ({
  blocks,
  blockOrder,
  onAddBlock,
  parentBlockId,
  parentSchema,
  sectionId,
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation
    if (!isSortable(source) || source.initialIndex === source.index) return

    editorActions.reorderBlocks(
      sectionId,
      reorderItems(blockOrder, source.initialIndex, source.index),
      parentBlockId,
    )
  }

  return (
    <NestedBlockList>
      <DragDropProvider onDragEnd={handleDragEnd}>
        {blockOrder.map((blockId, index) => {
          const block = blocks[blockId]

          const blockSchema =
            parentSchema.blocks?.find(
              (candidate) => candidate.type === block.type,
            ) || BlockRegistry[block.type].schema

          return (
            <SortableBlockEntry
              block={block}
              blockId={blockId}
              blockSchema={blockSchema}
              index={index}
              key={blockId}
              onAddBlock={onAddBlock}
              parentBlockId={parentBlockId}
              sectionId={sectionId}
            />
          )
        })}
      </DragDropProvider>

      {Boolean(parentSchema.blocks?.length) && (
        <AddBlockButton
          color="neutral"
          onClick={() => onAddBlock(parentBlockId)}
          size="sm"
          startIcon={<PlusSignIcon size={13} />}
          type="button"
          variant="dashed"
        >
          Add block
        </AddBlockButton>
      )}
    </NestedBlockList>
  )
}

interface SectionEntryProps {
  canRemove: boolean
  canReorder: boolean
  index: number
  onAddBlock: (parentBlockId?: string) => void
  schema: SectionSchema
  section: SectionInstance
  sectionId: string
}

const SectionEntry: React.FC<SectionEntryProps> = ({
  canRemove,
  canReorder,
  index,
  onAddBlock,
  schema,
  section,
  sectionId,
}) => {
  const selectedItem = useEditorSelectedItem()
  const [isCollapsed, setCollapsed] = useState(false)
  const { handleRef, isDragging, ref } = useSortable({
    disabled: !canReorder,
    group: 'sections',
    id: `section:${sectionId}`,
    index,
  })
  const blockOrder = section.block_order || []
  const hasChildren = blockOrder.length > 0

  return (
    <SortableEntry $isDragging={isDragging} ref={ref}>
      <TreeItem
        actions={
          <>
            {canReorder && (
              <Button
                aria-label="Drag to reorder section"
                color="neutral"
                ref={handleRef}
                size="icon"
                startIcon={<DragDropVerticalIcon size={15} />}
                title="Drag to reorder section"
                type="button"
                variant="ghost"
              />
            )}
            {canRemove && (
              <Button
                aria-label="Delete section"
                color="danger"
                onClick={() => editorActions.removeSection(sectionId)}
                size="icon"
                startIcon={<Delete02Icon size={13} />}
                title="Delete section"
                type="button"
                variant="ghost"
              />
            )}
          </>
        }
        active={
          selectedItem?.type === 'section' && selectedItem.id === sectionId
        }
        icon={<EditorItemIcon kind="section" type={section.type} />}
        onClick={() =>
          editorActions.selectItem({ type: 'section', id: sectionId })
        }
        startAction={
          hasChildren ? (
            <Button
              aria-expanded={!isCollapsed}
              aria-label={
                isCollapsed
                  ? 'Expand section blocks'
                  : 'Collapse section blocks'
              }
              color="neutral"
              onClick={() => setCollapsed((collapsed) => !collapsed)}
              size="icon"
              startIcon={
                isCollapsed ? (
                  <ArrowRight01Icon size={14} />
                ) : (
                  <ArrowDown01Icon size={14} />
                )
              }
              type="button"
              variant="ghost"
            />
          ) : undefined
        }
      >
        {schema.name || section.type}
      </TreeItem>

      {!isCollapsed && (
        <BlockList
          blocks={section.blocks || {}}
          blockOrder={blockOrder}
          onAddBlock={onAddBlock}
          parentSchema={schema}
          sectionId={sectionId}
        />
      )}
    </SortableEntry>
  )
}

export const SectionTree = () => {
  const template = useEditorTemplate()
  const [isAddSectionModalOpen, setAddSectionModalOpen] = useState(false)
  const [addBlockTarget, setAddBlockTarget] = useState<AddBlockTarget | null>(
    null,
  )

  const headerSectionIds = template.order.filter(
    (id) => template.sections[id].type === 'header',
  )
  const bodySectionIds = template.order.filter((id) => {
    const type = template.sections[id].type
    return type !== 'header' && type !== 'footer'
  })
  const footerSectionIds = template.order.filter(
    (id) => template.sections[id].type === 'footer',
  )

  const renderEntry = (
    sectionId: string,
    index: number,
    options: Pick<SectionEntryProps, 'canRemove' | 'canReorder'>,
  ) => {
    const section = template.sections[sectionId]
    const schema = SectionRegistry[section.type]?.schema
    if (!schema) return null

    return (
      <SectionEntry
        canRemove={options.canRemove}
        canReorder={options.canReorder}
        index={index}
        key={sectionId}
        onAddBlock={(parentBlockId) =>
          setAddBlockTarget({ sectionId, parentBlockId })
        }
        schema={schema}
        section={section}
        sectionId={sectionId}
      />
    )
  }

  const handleSectionDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation
    if (!isSortable(source) || source.initialIndex === source.index) return

    const reorderedBody = reorderItems(
      bodySectionIds,
      source.initialIndex,
      source.index,
    )
    let bodyIndex = 0
    const bodySet = new Set(bodySectionIds)
    const nextOrder = template.order.map((sectionId) =>
      bodySet.has(sectionId) ? reorderedBody[bodyIndex++] : sectionId,
    )
    editorActions.reorderSections(nextOrder)
  }

  const blockTargetSection = addBlockTarget
    ? template.sections[addBlockTarget.sectionId]
    : undefined
  const blockTargetLocation =
    blockTargetSection && addBlockTarget?.parentBlockId
      ? findBlockLocation(
          blockTargetSection.blocks,
          addBlockTarget.parentBlockId,
        )
      : undefined
  const blockTargetParent = blockTargetLocation?.block || blockTargetSection
  const blockTargetSchema = blockTargetParent
    ? blockTargetLocation
      ? BlockRegistry[blockTargetParent.type].schema
      : SectionRegistry[blockTargetSection!.type]?.schema
    : undefined

  return (
    <>
      <TreeGroup title="Header group">
        <DragDropProvider>
          {headerSectionIds.map((sectionId, index) =>
            renderEntry(sectionId, index, {
              canRemove: false,
              canReorder: false,
            }),
          )}
        </DragDropProvider>
      </TreeGroup>

      <TreeGroup title="Template sections">
        <DragDropProvider onDragEnd={handleSectionDragEnd}>
          {bodySectionIds.map((sectionId, index) =>
            renderEntry(sectionId, index, {
              canRemove: true,
              canReorder: true,
            }),
          )}
        </DragDropProvider>

        <AddSectionButton
          color="neutral"
          onClick={() => setAddSectionModalOpen(true)}
          size="sm"
          startIcon={<PlusSignIcon size={14} />}
          type="button"
          variant="dashed"
        >
          Add section
        </AddSectionButton>
      </TreeGroup>

      <TreeGroup title="Footer group">
        <DragDropProvider>
          {footerSectionIds.map((sectionId, index) =>
            renderEntry(sectionId, index, {
              canRemove: false,
              canReorder: false,
            }),
          )}
        </DragDropProvider>
      </TreeGroup>

      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onAddSection={(type, settings, blocks) =>
          editorActions.addSection(type, settings, blocks)
        }
        onClose={() => setAddSectionModalOpen(false)}
      />

      {addBlockTarget && blockTargetParent && blockTargetSchema && (
        <AddBlockModal
          isOpen
          onAddBlock={(type, settings) =>
            editorActions.addBlock(
              addBlockTarget.sectionId,
              type,
              settings,
              addBlockTarget.parentBlockId,
            )
          }
          onClose={() => setAddBlockTarget(null)}
          parent={blockTargetParent}
          parentSchema={blockTargetSchema}
        />
      )}
    </>
  )
}
