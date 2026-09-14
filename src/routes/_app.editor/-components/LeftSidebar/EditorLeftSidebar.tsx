import React from 'react'

import styled from '@emotion/styled'

import { theme } from '#/-components/ui/theme'
import { useEditorActiveTab } from '#/store/editorStore'

import { SectionTree } from './SectionTree'
import { SettingsList } from './SettingsList'

const LeftSidebarRoot = styled.aside`
  width: 280px;
  background-color: ${theme.colors.background};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
`

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export interface EditorLeftSidebarProps {
  className?: string
}

export const EditorLeftSidebar: React.FC<EditorLeftSidebarProps> = ({
  className,
}) => {
  const activeTab = useEditorActiveTab()

  return (
    <LeftSidebarRoot className={className}>
      <SidebarContent>
        {activeTab === 'sections' ? <SectionTree /> : <SettingsList />}
      </SidebarContent>
    </LeftSidebarRoot>
  )
}
