import React from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowDown01Icon,
  CheckmarkCircle02Icon,
  ComputerIcon,
  EyeIcon,
  Layers01Icon,
  LogoutSquare02Icon,
  RedoIcon,
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
} from '#/components/ui'
import {
  editorActions,
  useEditorCanUndoRedo,
  useEditorViewport,
} from '#/store/editorStore'

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
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 240px;
`

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const PageSelectorCapsule = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${theme.colors.background};
  border: 1px solid #dddddd;
  border-radius: 28px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-color: #cccccc;
  }
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
`

export interface EditorHeaderProps {
  pageName?: string
  previewUrl?: string
  className?: string
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  pageName = 'Home page',
  previewUrl = '/',
  className,
}) => {
  const viewport = useEditorViewport()
  const { canUndo, canRedo, isSaving, lastSavedAt } = useEditorCanUndoRedo()

  return (
    <TopHeader className={className}>
      <HeaderLeft>
        <Link to="/admin">
          <IconButton variant="ghost" title="Exit to Admin">
            <LogoutSquare02Icon style={{ rotate: '180deg' }} size={16} />
          </IconButton>
        </Link>
        <Divider orientation="vertical" />
      </HeaderLeft>

      <HeaderCenter>
        <PageSelectorCapsule type="button">
          <Layers01Icon size={16} color={theme.colors.primary} />
          <Typography
            variant="body"
            weight="medium"
            css={{ fontSize: '0.8125rem' }}
          >
            {pageName}
          </Typography>
          <ArrowDown01Icon size={14} color="#717171" />
        </PageSelectorCapsule>

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
    </TopHeader>
  )
}
