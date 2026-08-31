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

import { BlockList } from './BlockList'
import { EditorItemIcon } from './EditorItemIcon'
import { SortableEntry } from './sectionTreeStyles'
import { TreeItem } from './TreeItem'
import type { SectionInstance, SectionSchema } from '#themes/types/theme'

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
