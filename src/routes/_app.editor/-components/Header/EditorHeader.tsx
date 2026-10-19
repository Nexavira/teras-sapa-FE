import React, { useState } from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  CheckmarkCircle02Icon,
  ComputerIcon,
  Edit02Icon,
  EyeIcon,
  GridIcon,
  LogoutSquare02Icon,
  PaintBoardIcon,
  RedoIcon,
  Settings02Icon,
  SmartPhone01Icon,
  SparklesIcon,
  UndoIcon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Divider,
  IconButton,
  theme,
  Typography,
} from '#/-components/ui'
import {
  editorActions,
  useEditorActiveTab,
  useEditorCanUndoRedo,
  useEditorTheme,
  useEditorThemeData,
  useEditorViewport,
} from '#/store/editorStore'

import { EditThemeDataModal } from '../../-schema'

const TopHeader = styled.header`
  height: 60px;
  background-color: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  z-index: 50;
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  gap: 12px;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const ThemeCapsule = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
    background-color: #f1f5f9;
  }
`

const TabSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: ${theme.colors.muted};
  border-radius: ${theme.radius.md};
  padding: 2px;
  border: 1px solid ${theme.colors.border};
`

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ViewportSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: ${theme.colors.muted};
  border-radius: 9999px;
  padding: 2px;
  border: 1px solid ${theme.colors.border};
`

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`

export interface EditorHeaderProps {
  pageName?: string
  previewUrl?: string
  tenantTemplateUuid?: string
  onRefetchTenantTemplates?: () => void
  className?: string
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  previewUrl = '/',
  tenantTemplateUuid,
  onRefetchTenantTemplates,
  className,
}) => {
  const activeTheme = useEditorTheme()
  const themeData = useEditorThemeData()
  const activeTab = useEditorActiveTab()
  const viewport = useEditorViewport()
  const { canUndo, canRedo, isSaving, lastSavedAt } = useEditorCanUndoRedo()

  const [isEditThemeModalOpen, setIsEditThemeModalOpen] = useState(false)

  return (
    <TopHeader className={className}>
      <HeaderLeft>
        <Link to="/admin">
          <IconButton variant="ghost" title="Exit to Admin">
            <LogoutSquare02Icon style={{ rotate: '180deg' }} size={16} />
          </IconButton>
        </Link>

        {tenantTemplateUuid && (
          <>
            <ThemeCapsule
              type="button"
              onClick={() => setIsEditThemeModalOpen(true)}
              title="Edit Data Tema"
            >
              <PaintBoardIcon size={14} color={theme.colors.primary.DEFAULT} />
              <Typography
                variant="caption"
                weight="bold"
                style={{
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {themeData?.title || activeTheme.name}
              </Typography>
              <Badge
                size="sm"
                variant={themeData?.isPublished ? 'success' : 'neutral'}
              >
                {themeData?.isPublished ? 'Live' : 'Draft'}
              </Badge>
              <Edit02Icon
                size={13}
                style={{ color: theme.colors.text.secondary }}
              />
            </ThemeCapsule>
            <Divider orientation="vertical" />
          </>
        )}

        <TabSwitcher>
          <Button
            size="sm"
            variant={activeTab === 'sections' ? 'ghost' : 'text'}
            color={activeTab === 'sections' ? 'primary' : 'neutral'}
            data-active={activeTab === 'sections'}
            onClick={() => editorActions.setActiveTab('sections')}
            startIcon={<GridIcon size={15} />}
            css={{
              height: '28px',
              padding: '0 10px',
              fontSize: '0.8125rem',
            }}
          >
            Sections
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'settings' ? 'ghost' : 'text'}
            color={activeTab === 'settings' ? 'primary' : 'neutral'}
            data-active={activeTab === 'settings'}
            onClick={() => editorActions.setActiveTab('settings')}
            startIcon={<Settings02Icon size={15} />}
            css={{
              height: '28px',
              padding: '0 10px',
              fontSize: '0.8125rem',
            }}
          >
            Theme Settings
          </Button>
        </TabSwitcher>
      </HeaderLeft>

      <HeaderCenter>
        <ViewportSwitcher>
          <IconButton
            type="button"
            size="sm"
            variant={viewport === 'desktop' ? 'primary' : 'ghost'}
            onClick={() => editorActions.setViewport('desktop')}
            style={{ borderRadius: '9999px' }}
            title="Desktop View"
          >
            <ComputerIcon size={16} />
          </IconButton>
          <IconButton
            type="button"
            size="sm"
            variant={viewport === 'mobile' ? 'primary' : 'ghost'}
            onClick={() => editorActions.setViewport('mobile')}
            style={{ borderRadius: '9999px' }}
            title="Mobile View"
          >
            <SmartPhone01Icon size={16} />
          </IconButton>
        </ViewportSwitcher>
      </HeaderCenter>

      <HeaderRight>
        {lastSavedAt && (
          <Badge variant="success">
            <CheckmarkCircle02Icon size={13} />
            <span>Saved {lastSavedAt}</span>
          </Badge>
        )}

        <IconButton
          variant="ghost"
          size="sm"
          title="Undo (Ctrl+Z)"
          disabled={!canUndo}
          onClick={() => editorActions.undo()}
          style={{ opacity: canUndo ? 1 : 0.4 }}
        >
          <UndoIcon size={16} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          title="Redo (Ctrl+Y)"
          disabled={!canRedo}
          onClick={() => editorActions.redo()}
          style={{ opacity: canRedo ? 1 : 0.4 }}
        >
          <RedoIcon size={16} />
        </IconButton>

        <Link to={previewUrl} target="_blank">
          <Button size="sm" variant="outline">
            <EyeIcon size={15} style={{ marginRight: '5px' }} />
            Preview
          </Button>
        </Link>

        <Button
          size="sm"
          variant="solid"
          color="primary"
          onClick={() => editorActions.save()}
          disabled={isSaving}
          isLoading={isSaving}
        >
          <SparklesIcon size={15} style={{ marginRight: '5px' }} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </HeaderRight>

      {/* Edit Theme Data Modal */}
      {tenantTemplateUuid && (
        <EditThemeDataModal
          isOpen={isEditThemeModalOpen}
          tenantTemplateUuid={tenantTemplateUuid}
          currentTitle={themeData?.title || activeTheme.name}
          isPublished={Boolean(themeData?.isPublished)}
          isActive={Boolean(themeData?.isActive ?? true)}
          onClose={() => setIsEditThemeModalOpen(false)}
          onSuccess={() => {
            onRefetchTenantTemplates?.()
          }}
        />
      )}
    </TopHeader>
  )
}
