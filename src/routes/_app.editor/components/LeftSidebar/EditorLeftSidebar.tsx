import React from 'react'

import styled from '@emotion/styled'
import { GridIcon, Settings02Icon } from 'hugeicons-react'

import { theme } from '#/components/ui/theme'
import { editorActions, useEditorActiveTab } from '#/store/editorStore'

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

const SidebarTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
  padding: 4px 8px;
  background-color: ${theme.colors.background};
`

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) => ($active ? theme.colors.primary.DEFAULT : '#717171')};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.colors.primary.DEFAULT : 'transparent')};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #222222;
  }
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
      <SidebarTabs>
        <TabButton
          type="button"
          $active={activeTab === 'sections'}
          onClick={() => editorActions.setActiveTab('sections')}
        >
          <GridIcon size={15} />
          Sections
        </TabButton>
        <TabButton
          type="button"
          $active={activeTab === 'settings'}
          onClick={() => editorActions.setActiveTab('settings')}
        >
          <Settings02Icon size={15} />
          Theme Settings
        </TabButton>
      </SidebarTabs>

      <SidebarContent>
        {activeTab === 'sections' ? <SectionTree /> : <SettingsList />}
      </SidebarContent>
    </LeftSidebarRoot>
  )
}
