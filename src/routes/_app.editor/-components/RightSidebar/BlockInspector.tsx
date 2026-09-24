import { ArrowLeft01Icon, CubeIcon, Delete02Icon } from 'hugeicons-react'

import { findBlockLocation } from '#/lib/editor/blockTree'
import {
  editorActions,
  useEditorTemplate,
  useEditorTheme,
} from '#/store/editorStore'

import {
  MissingEntityState,
  SettingsFieldList,
  UnregisteredEntityView,
} from './inspectorShared'
import {
  ActionIconButton,
  BackButton,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  InspectorHeader,
} from './inspectorStyles'

interface BlockInspectorProps {
  sectionId: string
  blockId: string
}

export const BlockInspector = ({ sectionId, blockId }: BlockInspectorProps) => {
  const template = useEditorTemplate()
  const { BlockRegistry } = useEditorTheme()
  const section = template.sections[sectionId]
  const location = section.type
    ? findBlockLocation(section.blocks, blockId)
    : undefined
  const block = location?.block

  if (!block) {
    return (
      <MissingEntityState
        itemType="Block"
        itemId={blockId}
        onRemove={() => editorActions.removeBlock(sectionId, blockId)}
      />
    )
  }

  const handleBackToParent = () => {
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
  }

  const registered = BlockRegistry[block.type]
  const isRegistered = Boolean(registered)

  if (!isRegistered) {
    return (
      <UnregisteredEntityView
        type={block.type}
        entityName="Block"
        backTitle="Back to parent"
        onBack={handleBackToParent}
        onDelete={() => editorActions.removeBlock(sectionId, blockId)}
        message={`Block type "${block.type}" is not registered in the theme registry.`}
      />
    )
  }

  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = block.settings
  const handleFieldChange = (key: string, value: unknown) => {
    editorActions.updateBlockSettings(sectionId, blockId, { [key]: value })
  }

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back to parent"
            onClick={handleBackToParent}
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

      <SettingsFieldList
        settings={settingsList}
        values={currentSettings}
        onChange={handleFieldChange}
        emptyMessage="This block has no configurable settings."
        emptyIcon={<CubeIcon size={28} />}
      />
    </>
  )
}
