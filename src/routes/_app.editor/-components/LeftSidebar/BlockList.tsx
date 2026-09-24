import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { PlusSignIcon } from 'hugeicons-react'

import { findBlockLocation, reorderItems } from '#/lib/editor/blockTree'
import { editorActions, useEditorTheme } from '#/store/editorStore'

import { editorSensors, getBlockParentIdFromDndGroup } from './editorDnd'
import { AddBlockButton, NestedBlockList } from './sectionTreeStyles'
import { SortableBlockEntry } from './SortableBlockEntry'
import type { BlockInstance, BlockSchema, SectionSchema } from '#themes'

interface BlockListProps {
  blocks: Record<string, BlockInstance>
  blockOrder: Array<string>
  level?: number
  onAddBlock: (parentBlockId?: string) => void
  parentBlockId?: string
  parentSchema: SectionSchema | BlockSchema
  sectionId: string
}

const BlockListItems = ({
  blocks,
  blockOrder,
  level = 1,
  onAddBlock,
  parentBlockId,
  parentSchema,
  sectionId,
}: BlockListProps) => {
  const { BlockRegistry } = useEditorTheme()
  return (
    <NestedBlockList>
      {blockOrder.map((blockId, index) => {
        const block = blocks[blockId]
        const isMissing = !block.type
        const blockType = block.type || 'unknown'

        const candidateSchema = parentSchema.blocks?.find(
          (candidate) => candidate.type === blockType,
        )
        const registeredSchema = BlockRegistry[blockType].schema
        const isUnregistered = !candidateSchema && !registeredSchema
        const isError = isMissing || isUnregistered

        const blockSchema: BlockSchema = candidateSchema ||
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          registeredSchema || {
            type: blockType,
            name: isMissing
              ? `Missing block (${blockId})`
              : `Unregistered (${blockType})`,
            settings: [],
          }

        const safeBlock: BlockInstance = block.id
          ? block
          : {
              id: blockId,
              type: blockType,
              settings: {},
            }
        const childBlockOrder = safeBlock.block_order || []

        return (
          <SortableBlockEntry
            block={safeBlock}
            blockId={blockId}
            blockSchema={blockSchema}
            index={index}
            isError={isError}
            key={blockId}
            parentBlockId={parentBlockId}
            sectionId={sectionId}
          >
            {Boolean(blockSchema.blocks?.length) && (
              <BlockListItems
                blocks={safeBlock.blocks || {}}
                blockOrder={childBlockOrder}
                level={level + 1}
                onAddBlock={onAddBlock}
                parentBlockId={blockId}
                parentSchema={blockSchema}
                sectionId={sectionId}
              />
            )}
          </SortableBlockEntry>
        )
      })}

      {Boolean(parentSchema.blocks?.length) && (
        <AddBlockButton
          color="neutral"
          level={level}
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

export const BlockList = (props: BlockListProps) => {
  const { blocks, blockOrder, sectionId } = props

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation
    if (
      !isSortable(source) ||
      source.initialGroup !== source.group ||
      source.initialIndex === source.index
    ) {
      return
    }

    const parentBlockId = getBlockParentIdFromDndGroup(
      source.initialGroup,
      sectionId,
    )
    const sourceOrder = parentBlockId
      ? findBlockLocation(blocks, parentBlockId)?.block.block_order || []
      : blockOrder

    editorActions.reorderBlocks(
      sectionId,
      reorderItems(sourceOrder, source.initialIndex, source.index),
      parentBlockId,
    )
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd} sensors={editorSensors}>
      <BlockListItems {...props} />
    </DragDropProvider>
  )
}
