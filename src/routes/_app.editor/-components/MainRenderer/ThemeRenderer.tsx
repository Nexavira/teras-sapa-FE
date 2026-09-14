import React from 'react'

import styled from '@emotion/styled'

import { PreviewSectionWrapper } from '#/routes/preview/-components/PreviewSectionWrapper'
import {
  editorActions,
  useEditorGlobalSettings,
  useEditorSelectedItem,
  useEditorTemplate,
} from '#/store/editorStore'

import { ThemeLayout } from '#themes/layout/ThemeLayout'
import { SectionRegistry } from '#themes/registry'
import type { SpacingValue } from '#themes/types/theme'

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
  let footerSectionNode: React.ReactNode = null

  template.order.forEach((sectionId) => {
    const sectionInstance = template.sections[sectionId]

    const registered = SectionRegistry[sectionInstance.type]

    if (!registered) {
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

    const wrappedSection = (
      <PreviewSectionWrapper
        key={sectionId}
        id={sectionId}
        sectionType={sectionInstance.type}
        sectionName={registered.schema.name || sectionInstance.type}
        isSelected={isSelected}
        isEditor={isEditor}
        padding={sectionPadding}
        onSelect={(id, blockId, parentBlockId) => {
          editorActions.selectItem(
            blockId
              ? { type: 'block', id: blockId, sectionId: id, parentBlockId }
              : { type: 'section', id },
          )
        }}
      >
        {sectionContent}
      </PreviewSectionWrapper>
    )

    if (sectionInstance.type === 'header') {
      headerSectionNode = wrappedSection
    } else if (sectionInstance.type === 'footer') {
      footerSectionNode = wrappedSection
    } else {
      renderedSections.push(wrappedSection)
    }
  })

  return (
    <ThemeLayout
      globalSettings={globalSettings}
      headerComponent={headerSectionNode}
      footerComponent={footerSectionNode}
    >
      {renderedSections}
    </ThemeLayout>
  )
}
