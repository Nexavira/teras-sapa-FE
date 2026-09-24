import React, { useEffect } from 'react'

import styled from '@emotion/styled'

import { theme } from '#/-components/ui/theme'
import {
  editorActions,
  useEditorStore,
  useEditorTheme,
} from '#/store/editorStore'

import { EditorHeader } from './Header/EditorHeader'
import { EditorLeftSidebar } from './LeftSidebar/EditorLeftSidebar'
import { EditorMainRenderer } from './MainRenderer/EditorMainRenderer'
import { EditorRightSidebar } from './RightSidebar/EditorRightSidebar'
import { getTheme } from '#themes'

const ThemeEditorRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  font-family: ${theme.typography.fontFamily};
  background-color: ${theme.colors.muted};
`

const EditorBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

export interface ThemeEditorProps {
  pageName?: string
  previewUrl?: string
  themeId?: string
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  pageName = 'Home page',
  previewUrl = '/preview',
  themeId,
}) => {
  const requestedTheme = getTheme(themeId)
  const activeTheme = useEditorTheme()
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId)

  useEffect(() => {
    editorActions.setTheme(requestedTheme.id)
  }, [requestedTheme.id])

  if (activeTheme.id !== requestedTheme.id) return null

  const separator = previewUrl.includes('?') ? '&' : '?'
  const pagePreviewUrl = `${previewUrl}${separator}template=${encodeURIComponent(activeTemplateId)}&theme=${encodeURIComponent(activeTheme.id)}`
  const iframePreviewUrl = `${pagePreviewUrl}&mode=editor`

  return (
    <ThemeEditorRoot>
      <EditorHeader pageName={pageName} previewUrl={pagePreviewUrl} />
      <EditorBody>
        <EditorLeftSidebar />
        <EditorMainRenderer previewUrl={iframePreviewUrl} />
        <EditorRightSidebar />
      </EditorBody>
    </ThemeEditorRoot>
  )
}
