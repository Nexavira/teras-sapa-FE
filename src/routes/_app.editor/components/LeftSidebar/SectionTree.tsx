import React, { useState } from 'react'

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Layers01Icon,
  PaintBoardIcon,
  PlusSignIcon,
  Store01Icon,
} from 'hugeicons-react'

import {
  editorActions,
  useEditorSelectedItem,
  useEditorTemplate,
} from '#/store/editorStore'

import { AddSectionModal } from './AddSectionModal'
import {
  ActionBtn,
  AddSectionButton,
  SubBlockItem,
  TreeGroup,
  TreeItem,
} from './TreeItem'
import { BlockRegistry, SectionRegistry } from '#themes/registry'

export const SectionTree = () => {
  const template = useEditorTemplate()
  const selectedItem = useEditorSelectedItem()
  const [isAddSectionModalOpen, setAddSectionModalOpen] = useState(false)

  const headerSectionIds = template.order.filter(
    (id) => template.sections[id].type === 'header',
  )
  const bodySectionIds = template.order.filter(
    (id) =>
      template.sections[id].type !== 'header' &&
      template.sections[id].type !== 'footer',
  )

  return (
    <>
      {/* Header Group */}
      <TreeGroup title="Header Group">
        {headerSectionIds.map((secId) => {
          const sec = template.sections[secId]
          const schema = SectionRegistry[sec.type].schema
          const blockOrder = sec.block_order

          return (
            <React.Fragment key={secId}>
              <TreeItem
                active={
                  selectedItem?.type === 'section' && selectedItem.id === secId
                }
                icon={<Store01Icon size={16} />}
                onClick={() =>
                  editorActions.selectItem({
                    type: 'section',
                    id: secId,
                  })
                }
              >
                {schema.name || 'Header'}
              </TreeItem>

              {/* Render Child Blocks */}
              {blockOrder?.map((bId) => {
                const b = sec.blocks?.[bId]
                if (!b) return null
                const bSchema = BlockRegistry[b.type].schema

                return (
                  <SubBlockItem
                    key={bId}
                    active={
                      selectedItem?.type === 'block' && selectedItem.id === bId
                    }
                    onClick={() =>
                      editorActions.selectItem({
                        type: 'block',
                        id: bId,
                        sectionId: secId,
                      })
                    }
                  >
                    {bSchema.name || b.type}
                  </SubBlockItem>
                )
              })}
            </React.Fragment>
          )
        })}
      </TreeGroup>

      {/* Template Sections */}
      <TreeGroup title="Template Sections">
        {bodySectionIds.map((secId) => {
          const sec = template.sections[secId]
          if (!sec.id) return null

          const schema = SectionRegistry[sec.type].schema
          const blockOrder = sec.block_order

          return (
            <React.Fragment key={secId}>
              <TreeItem
                active={
                  selectedItem?.type === 'section' && selectedItem.id === secId
                }
                icon={<PaintBoardIcon size={16} />}
                onClick={() =>
                  editorActions.selectItem({
                    type: 'section',
                    id: secId,
                  })
                }
                actions={
                  <>
                    <ActionBtn
                      type="button"
                      title="Move Up"
                      onClick={(e) => {
                        e.stopPropagation()
                        editorActions.moveSection(secId, 'up')
                      }}
                    >
                      <ArrowUp01Icon size={13} />
                    </ActionBtn>
                    <ActionBtn
                      type="button"
                      title="Move Down"
                      onClick={(e) => {
                        e.stopPropagation()
                        editorActions.moveSection(secId, 'down')
                      }}
                    >
                      <ArrowDown01Icon size={13} />
                    </ActionBtn>
                    <ActionBtn
                      danger
                      type="button"
                      title="Delete Section"
                      onClick={(e) => {
                        e.stopPropagation()
                        editorActions.removeSection(secId)
                      }}
                    >
                      <Delete02Icon size={13} />
                    </ActionBtn>
                  </>
                }
              >
                {schema.name || sec.type}
              </TreeItem>

              {/* Render Child Blocks */}
              {blockOrder?.map((bId) => {
                const b = sec.blocks?.[bId]
                if (!b) return null
                const bSchema = BlockRegistry[b.type].schema

                return (
                  <SubBlockItem
                    key={bId}
                    active={
                      selectedItem?.type === 'block' && selectedItem.id === bId
                    }
                    onClick={() =>
                      editorActions.selectItem({
                        type: 'block',
                        id: bId,
                        sectionId: secId,
                      })
                    }
                  >
                    {bSchema.name || b.type}
                  </SubBlockItem>
                )
              })}
            </React.Fragment>
          )
        })}

        <AddSectionButton
          type="button"
          onClick={() => setAddSectionModalOpen(true)}
        >
          <PlusSignIcon size={14} /> Add Section
        </AddSectionButton>
      </TreeGroup>

      {/* Footer Group */}
      <TreeGroup title="Footer Group">
        <TreeItem
          active={false}
          icon={<Layers01Icon size={16} />}
          onClick={() =>
            editorActions.selectItem({
              type: 'global_settings_category',
              category: 'Colors',
            })
          }
        >
          Footer
        </TreeItem>
      </TreeGroup>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setAddSectionModalOpen(false)}
        onAddSection={(type, settings, blocks) =>
          editorActions.addSection(type, settings, blocks)
        }
      />
    </>
  )
}
