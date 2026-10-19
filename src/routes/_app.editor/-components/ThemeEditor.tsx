import React, { useEffect } from 'react'

import styled from '@emotion/styled'

import { theme } from '#/-components/ui/theme'
import { useGetTenantTemplatePages } from '#/services/cms/useGetTenantTemplatePages'
import { useGetTenantTemplates } from '#/services/cms/useGetTenantTemplates'
import { useGetCurrentTenant } from '#/services/tenant/useGetCurrentTenant'
import {
  editorActions,
  editorStore,
  useEditorStore,
  useEditorTheme,
} from '#/store/editorStore'

import { EditorHeader } from './Header/EditorHeader'
import { EditorLeftSidebar } from './LeftSidebar/EditorLeftSidebar'
import { EditorMainRenderer } from './MainRenderer/EditorMainRenderer'
import { EditorRightSidebar } from './RightSidebar/EditorRightSidebar'
import type { GlobalSettingsData, TemplateData } from '#themes'
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
  pageSlug?: string
  tenantTemplateUuid?: string
  onPageChange?: (slug: string) => void
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  pageName = 'Home page',
  previewUrl = '/preview',
  themeId,
  pageSlug,
  tenantTemplateUuid,
  onPageChange,
}) => {
  const requestedTheme = getTheme(themeId)
  const activeTheme = useEditorTheme()
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId)

  const { tenant } = useGetCurrentTenant()
  const { data: tenantTemplates, refetch: refetchTenantTemplates } =
    useGetTenantTemplates(tenant?.uuid)
  const { data: tenantPages = [], refetch: refetchTenantPages } =
    useGetTenantTemplatePages(tenantTemplateUuid)

  const currentTenantTemplate =
    tenantTemplates?.find((t) => t.uuid === tenantTemplateUuid) ?? null

  const customSettings = currentTenantTemplate?.template_settings as
    Record<string, unknown> | undefined

  const themeDisplayTitle =
    (customSettings?.theme_title as string) ||
    currentTenantTemplate?.global_template?.title ||
    requestedTheme.name

  useEffect(() => {
    editorActions.setTheme(requestedTheme.id)
  }, [requestedTheme.id])

  // Hydrate backend context and theme data if provided
  useEffect(() => {
    if (tenantTemplateUuid) {
      editorActions.setBackendContext(
        tenantTemplateUuid,
        undefined,
        undefined,
        {
          uuid: tenantTemplateUuid,
          title: themeDisplayTitle,
          isPublished: Boolean(currentTenantTemplate?.active_template),
          isActive: Boolean(currentTenantTemplate?.is_active ?? true),
        },
      )
    }
  }, [tenantTemplateUuid, themeDisplayTitle, currentTenantTemplate])

  // Hydrate custom template_settings (globalSettings) if exists
  useEffect(() => {
    if (
      customSettings &&
      'current' in customSettings &&
      typeof customSettings.current === 'object'
    ) {
      editorActions.hydrateFromBackend(
        editorStore.state.template,
        customSettings as unknown as GlobalSettingsData,
        editorStore.state.activePageUuid,
        editorStore.state.activePageData,
        {
          uuid: tenantTemplateUuid,
          title: themeDisplayTitle,
          isPublished: Boolean(currentTenantTemplate?.active_template),
          isActive: Boolean(currentTenantTemplate?.is_active ?? true),
        },
      )
    }
  }, [
    customSettings,
    tenantTemplateUuid,
    themeDisplayTitle,
    currentTenantTemplate,
  ])

  useEffect(() => {
    if (pageSlug) {
      const templateKey = pageSlug === 'home' ? 'index' : pageSlug
      editorActions.switchTemplate(templateKey)
    }
  }, [pageSlug])

  useEffect(() => {
    if (tenantPages.length > 0) {
      const targetSlug = pageSlug || 'home'
      const matchedPage =
        tenantPages.find(
          (p) =>
            p.slug === targetSlug ||
            (targetSlug === 'index' && p.slug === 'home') ||
            (targetSlug === 'home' && p.slug === 'index'),
        ) ?? tenantPages[0]

      if (matchedPage.uuid) {
        const pageData = {
          uuid: matchedPage.uuid,
          title: matchedPage.title,
          slug: matchedPage.slug,
          is_active: matchedPage.is_active,
        }
        const currentThemeData = {
          uuid: tenantTemplateUuid,
          title: themeDisplayTitle,
          isPublished: Boolean(currentTenantTemplate?.active_template),
          isActive: Boolean(currentTenantTemplate?.is_active ?? true),
        }

        editorActions.setBackendContext(
          tenantTemplateUuid,
          matchedPage.uuid,
          pageData,
          currentThemeData,
        )

        if (
          matchedPage.template_data &&
          typeof matchedPage.template_data === 'object' &&
          'sections' in matchedPage.template_data
        ) {
          editorActions.hydrateFromBackend(
            matchedPage.template_data as TemplateData,
            null,
            matchedPage.uuid,
            pageData,
            currentThemeData,
          )
        } else {
          editorActions.setActivePageData(pageData)
        }
      }
    }
  }, [
    tenantPages,
    pageSlug,
    tenantTemplateUuid,
    themeDisplayTitle,
    currentTenantTemplate,
  ])

  if (activeTheme.id !== requestedTheme.id) return null

  const separator = previewUrl.includes('?') ? '&' : '?'
  const pagePreviewUrl = `${previewUrl}${separator}template=${encodeURIComponent(activeTemplateId)}&theme=${encodeURIComponent(activeTheme.id)}`
  const iframePreviewUrl = `${pagePreviewUrl}&mode=editor`

  return (
    <ThemeEditorRoot>
      <EditorHeader
        pageName={pageName}
        previewUrl={pagePreviewUrl}
        tenantTemplateUuid={tenantTemplateUuid}
        onRefetchTenantTemplates={() => void refetchTenantTemplates()}
      />
      <EditorBody>
        <EditorLeftSidebar
          tenantTemplateUuid={tenantTemplateUuid}
          tenantPages={tenantPages}
          onPageChange={onPageChange}
          onRefetchTenantPages={() => void refetchTenantPages()}
        />
        <EditorMainRenderer previewUrl={iframePreviewUrl} />
        <EditorRightSidebar />
      </EditorBody>
    </ThemeEditorRoot>
  )
}
