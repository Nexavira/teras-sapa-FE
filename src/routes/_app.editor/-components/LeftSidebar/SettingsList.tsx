import { Settings02Icon } from 'hugeicons-react'

import {
  editorActions,
  useEditorSelectedItem,
  useEditorTheme,
} from '#/store/editorStore'

import { TreeGroup } from './TreeGroup'
import { TreeItem } from './TreeItem'

export const SettingsList = () => {
  const selectedItem = useEditorSelectedItem()
  const { settingsSchemaData } = useEditorTheme()

  return (
    <TreeGroup title="Global Theme Settings">
      {(settingsSchemaData as any[])
        .filter((cat) => cat.name !== 'theme_info')
        .map((cat) => (
          <TreeItem
            key={cat.name}
            active={
              selectedItem?.type === 'global_settings_category' &&
              selectedItem.category === cat.name
            }
            icon={<Settings02Icon size={16} />}
            onClick={() =>
              editorActions.selectItem({
                type: 'global_settings_category',
                category: cat.name,
              })
            }
          >
            {cat.name}
          </TreeItem>
        ))}
    </TreeGroup>
  )
}
