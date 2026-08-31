import {
  ArrowLeft01Icon,
  CubeIcon,
  Delete02Icon,
  InformationCircleIcon,
} from 'hugeicons-react'

import { findBlockLocation } from '#/lib/editor/blockTree'
import { editorActions, useEditorTemplate } from '#/store/editorStore'

import { DynamicSettingField } from './DynamicSettingField'
import {
  ActionIconButton,
  BackButton,
  EmptyStateContainer,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  InspectorBody,
  InspectorHeader,
} from './inspectorStyles'
import { BlockRegistry } from '#themes/registry'

interface BlockInspectorProps {
  sectionId: string
  blockId: string
}

export const BlockInspector = ({ sectionId, blockId }: BlockInspectorProps) => {
  const template = useEditorTemplate()
  const section = template.sections[sectionId]
  const location = findBlockLocation(section.blocks, blockId)
  const block = location?.block

  if (!block) {
    return (
      <EmptyStateContainer>
        <InformationCircleIcon size={32} />
        <div>Block not found: {blockId}</div>
      </EmptyStateContainer>
    )
  }

  const registered = BlockRegistry[block.type]
  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = block.settings
  const handleFieldChange = (key: string, value: any) => {
    editorActions.updateBlockSettings(sectionId, blockId, { [key]: value })
  }

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back to parent"
            onClick={() => {
              if (location.parentBlockId) {
                const parentLocation = findBlockLocation(
                  section.blocks,
                  location.parentBlockId,
                )
                editorActions.selectItem({
                  type: 'block',
                  id: location.parentBlockId,
                  sectionId,
                  parentBlockId: parentLocation?.parentBlockId,
                })
                return
              }

              editorActions.selectItem({ type: 'section', id: sectionId })
            }}
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{schema.name || block.type}</HeaderTitle>
            <HeaderSubtitle>Block Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>

        <ActionIconButton
          danger
          type="button"
          title="Delete Block"
          onClick={() => editorActions.removeBlock(sectionId, blockId)}
        >
          <Delete02Icon size={16} />
        </ActionIconButton>
      </InspectorHeader>

      <InspectorBody>
        {settingsList.length === 0 ? (
          <EmptyStateContainer>
            <CubeIcon size={28} />
            <div>This block has no configurable settings.</div>
          </EmptyStateContainer>
        ) : (
          settingsList.map((setting, index) => (
            <DynamicSettingField
              key={setting.id || index}
              setting={setting}
              value={currentSettings[setting.id]}
              onChange={handleFieldChange}
            />
          ))
        )}
      </InspectorBody>
    </>
  )
}
