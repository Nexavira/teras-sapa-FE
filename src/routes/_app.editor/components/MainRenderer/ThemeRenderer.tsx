import React from 'react'

import styled from '@emotion/styled'

import { Badge } from '#/components/ui'
import {
  editorActions,
  useEditorGlobalSettings,
  useEditorSelectedItem,
  useEditorTemplate,
} from '#/store/editorStore'

import { ThemeLayout } from '#themes/layout/ThemeLayout'
import { SectionRegistry } from '#themes/registry'
import type { SpacingValue } from '#themes/types/theme'

const EditorSectionBox = styled.div<{
  $isSelected: boolean
  $padding?: SpacingValue
}>`
  position: relative;
  transition:
    box-shadow 0.15s ease,
    outline 0.15s ease;
  outline: ${({ $isSelected }) =>
    $isSelected ? '2px solid #2563eb' : '1px dashed transparent'};
  outline-offset: -2px;
  cursor: pointer;

  ${({ $padding }) =>
    $padding
      ? `
    padding-top: ${$padding.top || 0}px;
    padding-right: ${$padding.right || 0}px;
    padding-bottom: ${$padding.bottom || 0}px;
    padding-left: ${$padding.left || 0}px;
  `
      : ''}

  &:hover {
    outline: ${({ $isSelected }) =>
      $isSelected ? '2px solid #2563eb' : '1px dashed #3b82f6'};
    outline-offset: -2px;
  }
`

const SectionBadge = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  top: 6px;
  left: 12px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#2563eb' : '#1e293b')};
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  transition: opacity 0.15s ease;

  ${EditorSectionBox}:hover & {
    opacity: 1;
  }
`

const MissingSectionPlaceholder = styled.div`
  padding: 32px;
  text-align: center;
  background-color: #fef2f2;
  border: 1px dashed #ef4444;
  color: #b91c1c;
  margin: 12px 0;
  border-radius: 8px;
  font-size: 13px;
`

export interface ThemeRendererProps {
  isEditor?: boolean
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({
  isEditor = true,
}) => {
  const template = useEditorTemplate()
  const globalSettings = useEditorGlobalSettings()
  const selectedItem = useEditorSelectedItem()

  const renderedSections: React.ReactNode[] = []
  let headerSectionNode: React.ReactNode = null

  template.order.forEach((sectionId) => {
    const sectionInstance = template.sections[sectionId]

    const registered = SectionRegistry[sectionInstance.type]
    if (!registered.Component.displayName) {
      renderedSections.push(
        <MissingSectionPlaceholder key={sectionId}>
          Unknown section type: <code>{sectionInstance.type}</code> (ID:{' '}
          {sectionId})
        </MissingSectionPlaceholder>,
      )
      return
    }

    const SectionComponent = registered.Component
    const isSelected =
      selectedItem?.type === 'section' && selectedItem.id === sectionId

    const sectionPadding: SpacingValue | undefined =
      sectionInstance.settings.padding

    const sectionContent = (
      <SectionComponent
        id={sectionId}
        settings={sectionInstance.settings}
        blocks={sectionInstance.blocks}
        blockOrder={sectionInstance.block_order}
        isEditor={isEditor}
      />
    )

    if (sectionInstance.type === 'header') {
      headerSectionNode = isEditor ? (
        <EditorSectionBox
          key={sectionId}
          $isSelected={isSelected}
          $padding={sectionPadding}
          onClick={(e) => {
            e.stopPropagation()
            editorActions.selectItem({ type: 'section', id: sectionId })
          }}
        >
          <Badge size="sm" color="primary">
            Header
          </Badge>
          {sectionContent}
        </EditorSectionBox>
      ) : sectionPadding ? (
        <div
          key={sectionId}
          style={{
            paddingTop: `${sectionPadding.top || 0}px`,
            paddingRight: `${sectionPadding.right || 0}px`,
            paddingBottom: `${sectionPadding.bottom || 0}px`,
            paddingLeft: `${sectionPadding.left || 0}px`,
          }}
        >
          {sectionContent}
        </div>
      ) : (
        <React.Fragment key={sectionId}>{sectionContent}</React.Fragment>
      )
    } else {
      renderedSections.push(
        isEditor ? (
          <EditorSectionBox
            key={sectionId}
            $isSelected={isSelected}
            $padding={sectionPadding}
            onClick={(e) => {
              e.stopPropagation()
              editorActions.selectItem({ type: 'section', id: sectionId })
            }}
          >
            <SectionBadge $isSelected={isSelected}>
              <span>🧩</span> {registered.schema.name || sectionInstance.type}
            </SectionBadge>
            {sectionContent}
          </EditorSectionBox>
        ) : sectionPadding ? (
          <div
            key={sectionId}
            style={{
              paddingTop: `${sectionPadding.top || 0}px`,
              paddingRight: `${sectionPadding.right || 0}px`,
              paddingBottom: `${sectionPadding.bottom || 0}px`,
              paddingLeft: `${sectionPadding.left || 0}px`,
            }}
          >
            {sectionContent}
          </div>
        ) : (
          <React.Fragment key={sectionId}>{sectionContent}</React.Fragment>
        ),
      )
    }
  })

  return (
    <ThemeLayout
      globalSettings={globalSettings}
      headerComponent={headerSectionNode}
    >
      {renderedSections}
    </ThemeLayout>
  )
}
