import { useState } from 'react'

import type { DragEndEvent } from '@dnd-kit/react'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { PlusSignIcon } from 'hugeicons-react'

import { findBlockLocation, reorderItems } from '#/lib/editor/blockTree'
import { editorActions, useEditorTemplate } from '#/store/editorStore'

import { AddBlockModal } from './AddBlockModal'
import { AddSectionModal } from './AddSectionModal'
import type { SectionEntryProps } from './SectionEntry'
import { SectionEntry } from './SectionEntry'
import { AddSectionButton } from './sectionTreeStyles'
import { TreeGroup } from './TreeGroup'
import { BlockRegistry, SectionRegistry } from '#themes/registry'

interface AddBlockTarget {
  sectionId: string
  parentBlockId?: string
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
