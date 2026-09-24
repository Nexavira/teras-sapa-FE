import type { ReactNode } from 'react'
import { useState } from 'react'

import { useSortable } from '@dnd-kit/react/sortable'
import { AlertCircleIcon, Delete02Icon } from 'hugeicons-react'

import { editorActions, useEditorSelectedItem } from '#/store/editorStore'

import { getBlockDndGroup } from './editorDnd'
import { EditorItemIcon } from './EditorItemIcon'
import { SortableEntry, SubNavList } from './sectionTreeStyles'
import { ActionIconButton, TreeItem } from './TreeItem'
import type { BlockInstance, BlockSchema } from '#themes'

interface SortableBlockEntryProps {
  block: BlockInstance
  blockId: string
  blockSchema: BlockSchema
  children?: ReactNode
  index: number
  isError?: boolean
  parentBlockId?: string
  sectionId: string
}

export const SortableBlockEntry = ({
  block,
  blockId,
  blockSchema,
  children,
  index,
  isError = false,
  parentBlockId,
  sectionId,
}: SortableBlockEntryProps) => {
  const selectedItem = useEditorSelectedItem()
  const [isCollapsed, setCollapsed] = useState(false)
  const { handleRef, isDragging, ref } = useSortable({
    id: `block:${blockId}`,
    index,
    group: getBlockDndGroup(sectionId, parentBlockId),
  })
  const supportsChildren = Boolean(blockSchema.blocks?.length)

  return (
    <SortableEntry $isDragging={isDragging} ref={ref}>
      <TreeItem
        actions={
          <ActionIconButton
            aria-label="Delete block"
            $variant="danger"
            onClick={(e) => {
              e.stopPropagation()
              editorActions.removeBlock(sectionId, blockId)
            }}
            title="Delete block"
          >
            <Delete02Icon size={13} />
          </ActionIconButton>
        }
        active={selectedItem?.type === 'block' && selectedItem.id === blockId}
        buttonRef={handleRef}
        hasChildren={supportsChildren}
        icon={
          isError ? (
            <AlertCircleIcon size={14} style={{ color: '#ef4444' }} />
          ) : (
            <EditorItemIcon kind="block" size={14} type={block.type} />
          )
        }
        index={index}
        isOpen={!isCollapsed}
        level={parentBlockId ? 2 : 1}
        onClick={() =>
          editorActions.selectItem({
            type: 'block',
            id: blockId,
            sectionId,
            parentBlockId,
          })
        }
        onToggleOpen={() => setCollapsed((collapsed) => !collapsed)}
      >
        <span
          style={isError ? { color: '#dc2626', fontWeight: 500 } : undefined}
        >
          {blockSchema.name || block.type}
        </span>
      </TreeItem>

      {supportsChildren && (
        <SubNavList $isOpen={!isCollapsed} aria-hidden={isCollapsed}>
          {children}
        </SubNavList>
      )}
    </SortableEntry>
  )
}
