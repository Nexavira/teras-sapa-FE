import React, { useEffect, useRef, useState } from 'react'

import styled from '@emotion/styled'

import type {
  EditorToPreviewMessage,
  PreviewSelectedItem,
} from '#/lib/editor/previewBridge'
import { PREVIEW_MESSAGE_TYPES } from '#/lib/editor/previewBridge'
import { editorActions } from '#/store/editorStore'

import { PreviewSectionWrapper } from './PreviewSectionWrapper'
import defaultSettingsData from '#themes/config/settings_data.json'
import { ThemeLayout } from '#themes/layout/ThemeLayout'
import { SectionRegistry } from '#themes/registry'
import defaultTemplateData from '#themes/templates/index.json'
import type {
  GlobalSettingsData,
  SpacingValue,
  TemplateData,
} from '#themes/types/theme'

const MissingSectionBox = styled.div`
  padding: 32px;
  text-align: center;
  background-color: #fef2f2;
  border: 1px dashed #ef4444;
  color: #b91c1c;
  margin: 16px 0;
  border-radius: 8px;
  font-size: 13px;
`

export interface PageRendererProps {
  mode?: 'editor' | 'preview'
  templateId?: string
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  mode = 'preview',
}) => {
  const isEditor = mode === 'editor'

  const [template, setTemplate] = useState<TemplateData>(
    defaultTemplateData as TemplateData,
  )
  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsData>(
    defaultSettingsData as GlobalSettingsData,
  )
  const [selectedItem, setSelectedItem] = useState<PreviewSelectedItem | null>(
    null,
  )

  const isMountedRef = useRef(false)

  // ============================================================================
  // PostMessage Bridge (Iframe <-> Editor Shell)
  // ============================================================================
  useEffect(() => {
    if (!isEditor) return

    const handleMessage = (event: MessageEvent<EditorToPreviewMessage>) => {
      const data = event.data

      switch (data.type) {
        case PREVIEW_MESSAGE_TYPES.SYNC_STATE: {
          if (data.payload.template.name) {
            setTemplate(data.payload.template)
            editorActions.setTemplate(data.payload.template)
          }
          // if (data.payload.globalSettings) {
          setGlobalSettings(data.payload.globalSettings)
          // if (data.payload.globalSettings.current) {
          editorActions.updateGlobalCategorySettings(
            data.payload.globalSettings.current,
          )
          // }
          // }
          break
        }

        case PREVIEW_MESSAGE_TYPES.SELECT_ITEM: {
          setSelectedItem(data.payload)
          editorActions.selectItem(data.payload)
          break
        }

        case PREVIEW_MESSAGE_TYPES.SCROLL_TO_SECTION: {
          const sectionEl = document.getElementById(
            `teras-sapa-section-${data.payload.sectionId}`,
          )
          if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          break
        }

        default:
          break
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify parent window that the preview iframe is ready and mounted
    if (window.parent !== window) {
      window.parent.postMessage(
        { type: PREVIEW_MESSAGE_TYPES.IFRAME_READY },
        '*',
      )
    }

    isMountedRef.current = true

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [isEditor])

  // ============================================================================
  // User Click & Hover Dispatchers
  // ============================================================================
  const handleSelectSection = (
    sectionId: string,
    blockId?: string,
    parentBlockId?: string,
  ) => {
    if (!isEditor) return

    if (blockId) {
      const payload: PreviewSelectedItem = {
        type: 'block',
        id: blockId,
        sectionId,
        ...(parentBlockId ? { parentBlockId } : {}),
      }
      setSelectedItem(payload)
      editorActions.selectItem(payload)
      window.parent.postMessage(
        {
          type: PREVIEW_MESSAGE_TYPES.ITEM_CLICKED,
          payload,
        },
        '*',
      )
    } else {
      const payload: PreviewSelectedItem = {
        type: 'section',
        id: sectionId,
      }
      setSelectedItem(payload)
      editorActions.selectItem(payload)
      window.parent.postMessage(
        {
          type: PREVIEW_MESSAGE_TYPES.ITEM_CLICKED,
          payload,
        },
        '*',
      )
    }
  }

  const handleHoverSection = (sectionId: string | null) => {
    if (!isEditor) return

    window.parent.postMessage(
      {
        type: PREVIEW_MESSAGE_TYPES.ITEM_HOVERED,
        payload: sectionId ? { type: 'section', id: sectionId } : null,
      },
      '*',
    )
  }

  // ============================================================================
  // Section Rendering Pipeline
  // ============================================================================
  const renderedSections: React.ReactNode[] = []
  let headerSectionNode: React.ReactNode = null
  let footerSectionNode: React.ReactNode = null

  template.order.forEach((sectionId) => {
    const sectionInstance = template.sections[sectionId]

    const registered = SectionRegistry[sectionInstance.type]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!registered) {
      renderedSections.push(
        <MissingSectionBox key={sectionId}>
          Unknown section type: <code>{sectionInstance.type}</code> (ID:{' '}
          {sectionId})
        </MissingSectionBox>,
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
        onSelect={handleSelectSection}
        onHover={handleHoverSection}
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
