import { useState } from 'react'

import { useSortable } from '@dnd-kit/react/sortable'
import { Delete02Icon } from 'hugeicons-react'

import { editorActions, useEditorSelectedItem } from '#/store/editorStore'

import { BlockList } from './BlockList'
import { EditorItemIcon } from './EditorItemIcon'
import { SortableEntry, SubNavList } from './sectionTreeStyles'
import { ActionIconButton, TreeItem } from './TreeItem'
import type { SectionInstance, SectionSchema } from '#themes'

export interface SectionEntryProps {
  canRemove: boolean
  canReorder: boolean
  index: number
  onAddBlock: (parentBlockId?: string) => void
  schema: SectionSchema
  section: SectionInstance
  sectionId: string
}

export const SectionEntry = ({
  canRemove,
  canReorder,
  index,
  onAddBlock,
  schema,
  section,
  sectionId,
}: SectionEntryProps) => {
  const selectedItem = useEditorSelectedItem()
  const [isCollapsed, setCollapsed] = useState(false)
  const { handleRef, isDragging, ref } = useSortable({
    disabled: !canReorder,
    group: 'sections',
    id: `section:${sectionId}`,
    index,
  })
  const blockOrder = section.block_order || []
  const supportsChildren = Boolean(schema.blocks?.length)

  return (
    <SortableEntry $isDragging={isDragging} ref={ref}>
      <TreeItem
        actions={
          canRemove ? (
            <ActionIconButton
              aria-label="Delete section"
              $variant="danger"
              onClick={(e) => {
                e.stopPropagation()
                editorActions.removeSection(sectionId)
              }}
              title="Delete section"
            >
              <Delete02Icon size={13} />
            </ActionIconButton>
          ) : undefined
        }
        active={
          selectedItem?.type === 'section' && selectedItem.id === sectionId
        }
        buttonRef={canReorder ? handleRef : undefined}
        hasChildren={supportsChildren}
        icon={<EditorItemIcon kind="section" type={section.type} />}
        isOpen={!isCollapsed}
        onClick={() =>
          editorActions.selectItem({ type: 'section', id: sectionId })
        }
        onToggleOpen={() => setCollapsed((collapsed) => !collapsed)}
      >
        {schema.name || section.type}
      </TreeItem>

      {supportsChildren && (
        <SubNavList $isOpen={!isCollapsed} aria-hidden={isCollapsed}>
          <BlockList
            blocks={section.blocks || {}}
            blockOrder={blockOrder}
            onAddBlock={onAddBlock}
            parentSchema={schema}
            sectionId={sectionId}
          />
        </SubNavList>
      )}
    </SortableEntry>
  )
}
