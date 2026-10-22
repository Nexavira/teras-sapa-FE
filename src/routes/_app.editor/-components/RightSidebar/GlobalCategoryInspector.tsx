import { ArrowLeft01Icon, Settings02Icon } from 'hugeicons-react'

import {
  editorActions,
  useEditorGlobalSettings,
  useEditorTheme,
} from '#/store/editorStore'

import { ColorSchemeGroupManager } from './ColorSchemeGroupManager'
import { DynamicSettingField } from './DynamicSettingField'
import {
  BackButton,
  EmptyStateContainer,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitleGroup,
  InspectorBody,
  InspectorHeader,
} from './inspectorStyles'
import type { SettingDefinition } from '#themes'

interface GlobalCategoryInspectorProps {
  categoryName: string
}

export const GlobalCategoryInspector = ({
  categoryName,
}: GlobalCategoryInspectorProps) => {
  const globalSettings = useEditorGlobalSettings()
  const { settingsSchemaData } = useEditorTheme()
  const categories = (settingsSchemaData as Array<any>).filter(
    (category) => category.name !== 'theme_info',
  )
  const activeCategory = categories.find(
    (category) => category.name === categoryName,
  )

  if (!activeCategory) {
    return (
      <EmptyStateContainer>
        <Settings02Icon size={32} />
        <div>Category not found: {categoryName}</div>
      </EmptyStateContainer>
    )
  }

  const settingsList: Array<SettingDefinition> = activeCategory.settings
  const currentGlobalValues = globalSettings.current
  const handleFieldChange = (key: string, value: any) => {
    editorActions.updateGlobalSetting(key, value)
  }
  const isColorsCategory = categoryName.toLowerCase() === 'colors'

  return (
    <>
      <InspectorHeader>
        <HeaderTitleGroup>
          <BackButton
            type="button"
            title="Back"
            onClick={() => editorActions.selectItem(null)}
          >
            <ArrowLeft01Icon size={18} />
          </BackButton>
          <div>
            <HeaderTitle>{categoryName}</HeaderTitle>
            <HeaderSubtitle>Theme Settings</HeaderSubtitle>
          </div>
        </HeaderTitleGroup>
      </InspectorHeader>

      <InspectorBody>
        {isColorsCategory && <ColorSchemeGroupManager />}

        {settingsList.map((setting, index) => (
          <DynamicSettingField
            key={setting.id || index}
            setting={setting}
            value={currentGlobalValues[setting.id]}
            onChange={handleFieldChange}
          />
        ))}
      </InspectorBody>
    </>
  )
}
