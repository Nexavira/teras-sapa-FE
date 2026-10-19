import type { FC, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Global } from '@emotion/react'

import { blockEditorSurfaceStyles } from '#/-components/editor/EditorSurface'
import type {
  EditorToPreviewMessage,
  ItemHoveredMessage,
  PreviewSelectedItem,
} from '#/lib/editor/previewBridge'
import { PREVIEW_MESSAGE_TYPES } from '#/lib/editor/previewBridge'
import { editorActions } from '#/store/editorStore'

import { EditorHoverOverlay } from './EditorHoverOverlay'
import { PreviewSectionWrapper } from './PreviewSectionWrapper'
import type { GlobalSettingsData, SpacingValue, TemplateData } from '#themes'
import {
  BlockRegistry,
  defaultSettingsData,
  getTemplate,
  getTheme,
  normalizeTemplate,
  SectionRegistry,
  ThemeEditorProvider,
  ThemeErrorBoundary,
  ThemeErrorCard,
  ThemeLayout,
} from '#themes'

export interface PageRendererProps {
  mode?: 'editor' | 'preview'
  templateId?: string
  themeId?: string
  initialTemplate?: TemplateData | null
  initialGlobalSettings?: GlobalSettingsData | null
  tenantSlug?: string
  tenantName?: string
  pageTitle?: string
}

export const PageRenderer: FC<PageRendererProps> = ({
  mode = 'preview',
  templateId = 'index',
  themeId,
  initialTemplate,
  initialGlobalSettings,
}) => {
  const isEditor = mode === 'editor'

  const selectedTheme = themeId ? getTheme(themeId) : null
  const activeGetTemplate = selectedTheme?.getTemplate || getTemplate
  const activeNormalizeTemplate =
    selectedTheme?.normalizeTemplate || normalizeTemplate
  const ActiveSectionRegistry =
    selectedTheme?.SectionRegistry || SectionRegistry
  const ActiveBlockRegistry = selectedTheme?.BlockRegistry || BlockRegistry
  const ActiveThemeLayout = selectedTheme?.ThemeLayout || ThemeLayout
  const activeDefaultSettings =
    selectedTheme?.defaultSettingsData || defaultSettingsData

  const [template, setTemplate] = useState<TemplateData>(() =>
    initialTemplate
      ? activeNormalizeTemplate(initialTemplate)
      : activeNormalizeTemplate(activeGetTemplate(templateId)),
  )
  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsData>(
    () => initialGlobalSettings ?? activeDefaultSettings,
  )
  const [selectedItem, setSelectedItem] = useState<PreviewSelectedItem | null>(
    null,
  )
  const [hoveredItem, setHoveredItem] =
    useState<ItemHoveredMessage['payload']>(null)

  useEffect(() => {
    editorActions.setTheme(selectedTheme?.id || getTheme().id)
    if (initialTemplate) {
      setTemplate(activeNormalizeTemplate(initialTemplate))
    } else {
      setTemplate(activeNormalizeTemplate(activeGetTemplate(templateId)))
    }
    if (initialGlobalSettings) {
      setGlobalSettings(initialGlobalSettings)
    } else {
      setGlobalSettings(activeDefaultSettings)
    }
    setSelectedItem(null)
    setHoveredItem(null)
  }, [
    activeDefaultSettings,
    activeGetTemplate,
    activeNormalizeTemplate,
    initialGlobalSettings,
    initialTemplate,
    selectedTheme?.id,
    templateId,
  ])

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
            setTemplate(activeNormalizeTemplate(data.payload.template))
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

        case PREVIEW_MESSAGE_TYPES.HOVER_ITEM: {
          setHoveredItem(
            data.payload
              ? {
                  type: data.payload.type === 'block' ? 'block' : 'section',
                  id: data.payload.id || '',
                  sectionId: data.payload.sectionId,
                  parentBlockId: data.payload.parentBlockId,
                }
              : null,
          )
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
  }, [activeNormalizeTemplate, isEditor])

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

  const handleHoverSection = (item: ItemHoveredMessage['payload']) => {
    if (!isEditor) return

    setHoveredItem(item)

    window.parent.postMessage(
      {
        type: PREVIEW_MESSAGE_TYPES.ITEM_HOVERED,
        payload: item,
      },
      '*',
    )
  }

  // Clear hover bounding box when cursor leaves window/document
  useEffect(() => {
    if (!isEditor) return

    const handleMouseLeave = () => {
      setHoveredItem(null)
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isEditor])

  // ============================================================================
  // Section Rendering Pipeline
  // ============================================================================
  const renderedSections: Array<ReactNode> = []
  let headerSectionNode: ReactNode = null
  let footerSectionNode: ReactNode = null

  template.order.forEach((sectionId) => {
    const sectionInstance = template.sections[sectionId]

    // 1. Guard against missing section instance
    if (!sectionInstance.type) {
      const isSelected =
        selectedItem?.type === 'section' && selectedItem.id === sectionId

      const missingSection = (
        <PreviewSectionWrapper
          key={sectionId}
          id={sectionId}
          sectionType="unknown"
          sectionName={`Missing: ${sectionId}`}
          isSelected={isSelected}
          isEditor={isEditor}
          onSelect={handleSelectSection}
          onHover={handleHoverSection}
        >
          <ThemeErrorCard
            kind="section"
            id={sectionId}
            title="Section Data Missing"
            message={`Section "${sectionId}" is listed in template order, but is undefined in template sections.`}
            isEditor={isEditor}
          />
        </PreviewSectionWrapper>
      )
      renderedSections.push(missingSection)
      return
    }

    const registered = ActiveSectionRegistry[sectionInstance.type]

    // 2. Guard against unregistered section component
    if (!registered) {
      const isSelected =
        selectedItem?.type === 'section' && selectedItem.id === sectionId

      const unregisteredSection = (
        <PreviewSectionWrapper
          key={sectionId}
          id={sectionId}
          sectionType={sectionInstance.type}
          sectionName={`Unregistered: ${sectionInstance.type}`}
          isSelected={isSelected}
          isEditor={isEditor}
          padding={sectionInstance.settings.padding}
          onSelect={handleSelectSection}
          onHover={handleHoverSection}
        >
          <ThemeErrorCard
            kind="section"
            id={sectionId}
            type={sectionInstance.type}
            title="Section Component Not Found"
            message={`Section type "${sectionInstance.type}" is not registered in SectionRegistry. Check the theme's registry.ts or section definitions.`}
            isEditor={isEditor}
          />
        </PreviewSectionWrapper>
      )

      if (sectionInstance.type === 'header') {
        headerSectionNode = unregisteredSection
      } else if (sectionInstance.type === 'footer') {
        footerSectionNode = unregisteredSection
      } else {
        renderedSections.push(unregisteredSection)
      }
      return
    }

    const SectionComponent = registered.Component
    const isSelected =
      selectedItem?.type === 'section' && selectedItem.id === sectionId
    const sectionPadding: SpacingValue | undefined =
      sectionInstance.settings.padding

    const sectionContent = (
      <ThemeErrorBoundary
        kind="section"
        id={sectionId}
        type={sectionInstance.type}
        name={registered.schema.name}
        isEditor={isEditor}
      >
        <SectionComponent
          id={sectionId}
          settings={sectionInstance.settings}
          blocks={sectionInstance.blocks || {}}
          blockOrder={sectionInstance.block_order || []}
          isEditor={isEditor}
        />
      </ThemeErrorBoundary>
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
    <ThemeEditorProvider
      value={{
        selectedItem,
        selectBlock: (selection) =>
          handleSelectSection(
            selection.sectionId,
            selection.id,
            selection.parentBlockId,
          ),
        blockRegistry: ActiveBlockRegistry,
      }}
    >
      {isEditor && <Global styles={blockEditorSurfaceStyles} />}
      <ActiveThemeLayout
        globalSettings={globalSettings}
        headerComponent={headerSectionNode}
        footerComponent={footerSectionNode}
      >
        {renderedSections}
      </ActiveThemeLayout>
      {isEditor && (
        <EditorHoverOverlay
          hoveredItem={hoveredItem}
          selectedItem={selectedItem}
        />
      )}
    </ThemeEditorProvider>
  )
}
