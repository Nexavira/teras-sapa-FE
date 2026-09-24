import { ArrowLeft01Icon, Delete02Icon } from 'hugeicons-react'

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

interface SectionInspectorProps {
  sectionId: string
}

export const SectionInspector = ({ sectionId }: SectionInspectorProps) => {
  const template = useEditorTemplate()
  const { SectionRegistry } = useEditorTheme()
  const section = template.sections[sectionId]

  if (!section.type) {
    return (
      <MissingEntityState
        itemType="Section"
        itemId={sectionId}
        onRemove={() => editorActions.removeSection(sectionId)}
      />
    )
  }

  const registered = SectionRegistry[section.type]

  if (!registered) {
    return (
      <UnregisteredEntityView
        type={section.type}
        entityName="Section"
        backTitle="Back to outline"
        onBack={() => editorActions.selectItem(null)}
        onDelete={() => editorActions.removeSection(sectionId)}
        message={`Section type "${section.type}" is not registered in SectionRegistry.`}
      />
    )
  }

  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = section.settings
  const handleFieldChange = (key: string, value: unknown) => {
    editorActions.updateSectionSettings(sectionId, { [key]: value })
  }

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back to outline"
            onClick={() => editorActions.selectItem(null)}
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{schema.name || section.type}</HeaderTitle>
            <HeaderSubtitle>Section Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>

        {section.type !== 'header' && section.type !== 'footer' && (
          <ActionIconButton
            danger
            type="button"
            title="Delete Section"
            onClick={() => editorActions.removeSection(sectionId)}
          >
            <Delete02Icon size={16} />
          </ActionIconButton>
        )}
      </InspectorHeader>

      <SettingsFieldList
        settings={settingsList}
        values={currentSettings}
        onChange={handleFieldChange}
        emptyMessage="This section has no configurable settings."
      />
    </>
  )
}
