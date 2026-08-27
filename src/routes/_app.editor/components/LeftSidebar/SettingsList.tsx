import React from 'react'

import { Settings02Icon } from 'hugeicons-react'

import { editorActions, useEditorSelectedItem } from '#/store/editorStore'

import { TreeGroup, TreeItem } from './TreeItem'
import settingsSchemaData from '#themes/config/settings_schema.json'

export const SettingsList = () => {
  const selectedItem = useEditorSelectedItem()

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
            icon={<Settings02Icon size={15} />}
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
