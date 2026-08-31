import type { ReactNode } from 'react'
import { useState } from 'react'

import { useSortable } from '@dnd-kit/react/sortable'
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
} from 'hugeicons-react'

import { Button } from '#/components/ui'
import { editorActions, useEditorSelectedItem } from '#/store/editorStore'

import { EditorItemIcon } from './EditorItemIcon'
import { SortableEntry } from './sectionTreeStyles'
import { SubBlockItem } from './SubBlockItem'
import type { BlockInstance, BlockSchema } from '#themes/types/theme'

interface SortableBlockEntryProps {
  block: BlockInstance
  blockId: string
  blockSchema: BlockSchema
  children?: ReactNode
  index: number
  parentBlockId?: string
  sectionId: string
}

export const SortableBlockEntry = ({
  block,
  blockId,
  blockSchema,
  children,
  index,
  parentBlockId,
  sectionId,
}: SortableBlockEntryProps) => {
  const selectedItem = useEditorSelectedItem()
  const [isCollapsed, setCollapsed] = useState(false)
  const { handleRef, isDragging, ref } = useSortable({
    id: `block:${blockId}`,
    index,
    group: `blocks:${sectionId}:${parentBlockId || 'root'}`,
  })
  const hasChildren = Boolean(block.block_order?.length)

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

      {!isCollapsed && children}
    </SortableEntry>
  )
}
