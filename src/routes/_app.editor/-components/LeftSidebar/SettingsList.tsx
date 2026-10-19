import { useState } from 'react'

import styled from '@emotion/styled'
import { Edit02Icon, PaintBoardIcon, Settings02Icon } from 'hugeicons-react'

import { Badge, IconButton, theme, Typography } from '#/-components/ui'
import {
  editorActions,
  useEditorSelectedItem,
  useEditorStore,
  useEditorTheme,
  useEditorThemeData,
} from '#/store/editorStore'

import { EditThemeDataModal } from '../../-schema'
import { TreeGroup } from './TreeGroup'
import { TreeItem } from './TreeItem'

const ThemeInfoBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  gap: 8px;
  margin-bottom: 4px;
`

const ThemeInfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const ThemeInfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  span.category {
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const SettingsList = () => {
  const selectedItem = useEditorSelectedItem()
  const activeTheme = useEditorTheme()
  const themeData = useEditorThemeData()
  const tenantTemplateUuid = useEditorStore((state) => state.tenantTemplateUuid)
  const [isEditThemeModalOpen, setEditThemeModalOpen] = useState(false)
  const { settingsSchemaData } = activeTheme

  return (
    <>
      <ThemeInfoBanner>
        <ThemeInfoLeft>
          <PaintBoardIcon size={18} color={theme.colors.primary.DEFAULT} />
          <ThemeInfoText>
            <Typography
              variant="caption"
              weight="bold"
              style={{ lineHeight: 1.2 }}
            >
              {themeData?.title || activeTheme.name}
            </Typography>
            <span className="category">
              Base: {activeTheme.name} ({activeTheme.category})
            </span>
          </ThemeInfoText>
        </ThemeInfoLeft>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Badge
            size="sm"
            variant={themeData?.isPublished ? 'success' : 'neutral'}
          >
            {themeData?.isPublished ? 'Live' : 'Draft'}
          </Badge>
          {tenantTemplateUuid && (
            <IconButton
              size="sm"
              variant="ghost"
              title="Edit Data Tema"
              onClick={() => setEditThemeModalOpen(true)}
            >
              <Edit02Icon size={14} />
            </IconButton>
          )}
        </div>
      </ThemeInfoBanner>

      <TreeGroup title="Global Theme Settings">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(settingsSchemaData as Array<any>)
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

      {tenantTemplateUuid && (
        <EditThemeDataModal
          isOpen={isEditThemeModalOpen}
          tenantTemplateUuid={tenantTemplateUuid}
          currentTitle={themeData?.title || activeTheme.name}
          isPublished={Boolean(themeData?.isPublished)}
          isActive={Boolean(themeData?.isActive ?? true)}
          onClose={() => setEditThemeModalOpen(false)}
        />
      )}
    </>
  )
}
