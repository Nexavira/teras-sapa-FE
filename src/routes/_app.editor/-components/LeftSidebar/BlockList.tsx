import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { PlusSignIcon } from 'hugeicons-react'

import { reorderItems } from '#/lib/editor/blockTree'
import { editorActions } from '#/store/editorStore'

import { AddBlockButton, NestedBlockList } from './sectionTreeStyles'
import { SortableBlockEntry } from './SortableBlockEntry'
import { BlockRegistry } from '#themes/registry'
import type {
  BlockInstance,
  BlockSchema,
  SectionSchema,
} from '#themes/types/theme'

interface BlockListProps {
  blocks: Record<string, BlockInstance>
  blockOrder: string[]
  onAddBlock: (parentBlockId?: string) => void
  parentBlockId?: string
  parentSchema: SectionSchema | BlockSchema
  sectionId: string
}

export const BlockList = ({
  blocks,
  blockOrder,
  onAddBlock,
  parentBlockId,
  parentSchema,
  sectionId,
}: BlockListProps) => {
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
          const childBlockOrder = block.block_order || []

          return (
            <SortableBlockEntry
              block={block}
              blockId={blockId}
              blockSchema={blockSchema}
              index={index}
              key={blockId}
              parentBlockId={parentBlockId}
              sectionId={sectionId}
            >
              {Boolean(blockSchema.blocks?.length) && (
                <BlockList
                  blocks={block.blocks || {}}
                  blockOrder={childBlockOrder}
                  onAddBlock={onAddBlock}
                  parentBlockId={blockId}
                  parentSchema={blockSchema}
                  sectionId={sectionId}
                />
              )}
            </SortableBlockEntry>
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
