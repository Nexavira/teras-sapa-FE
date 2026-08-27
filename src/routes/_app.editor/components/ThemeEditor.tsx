import React from 'react'

import styled from '@emotion/styled'

import { theme } from '#/components/ui/theme'

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
  const iframePreviewUrl = `${previewUrl}?mode=editor`

  return (
    <ThemeEditorRoot>
      <EditorHeader pageName={pageName} previewUrl={previewUrl} />
      <EditorBody>
        <EditorLeftSidebar />
        <EditorMainRenderer previewUrl={iframePreviewUrl} />
        <EditorRightSidebar />
      </EditorBody>
    </ThemeEditorRoot>
  )
}
