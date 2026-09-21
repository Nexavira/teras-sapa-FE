import React from 'react'

import styled from '@emotion/styled'

import { theme } from '#/-components/ui/theme'
import { useEditorStore } from '#/store/editorStore'

import { EditorHeader } from './Header/EditorHeader'
import { EditorLeftSidebar } from './LeftSidebar/EditorLeftSidebar'
import { EditorMainRenderer } from './MainRenderer/EditorMainRenderer'
import { EditorRightSidebar } from './RightSidebar/EditorRightSidebar'

const ThemeEditorRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  pageName = 'Home page',
  previewUrl = '/preview',
}) => {
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId)
  const separator = previewUrl.includes('?') ? '&' : '?'
  const pagePreviewUrl = `${previewUrl}${separator}template=${encodeURIComponent(activeTemplateId)}`
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
