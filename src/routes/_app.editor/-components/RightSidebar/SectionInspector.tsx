import {
  ArrowLeft01Icon,
  Delete02Icon,
  InformationCircleIcon,
  Layers01Icon,
} from 'hugeicons-react'

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
import { SectionRegistry } from '#themes/registry'

interface SectionInspectorProps {
  sectionId: string
}

export const SectionInspector = ({ sectionId }: SectionInspectorProps) => {
  const template = useEditorTemplate()
  const section = template.sections[sectionId]
  const registered = SectionRegistry[section.type]

  if (!registered) {
    return (
      <EmptyStateContainer>
        <InformationCircleIcon size={32} />
        <div>Unknown section type: {section.type}</div>
      </EmptyStateContainer>
    )
  }

  const schema = registered.schema
  const settingsList = schema.settings
  const currentSettings = section.settings
  const handleFieldChange = (key: string, value: any) => {
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

      <InspectorBody>
        {settingsList.length === 0 ? (
          <EmptyStateContainer>
            <Layers01Icon size={28} />
            <div>This section has no configurable settings.</div>
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
