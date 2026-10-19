import React, { useState } from 'react'

import styled from '@emotion/styled'
import {
  ArrowDown01Icon,
  Edit02Icon,
  Layers01Icon,
  PlusSignIcon,
} from 'hugeicons-react'

import { Badge, IconButton, theme, Typography } from '#/-components/ui'
import { CreatePageModal } from '#/routes/_authenticated/admin/themes/-schema/CreatePageModal'
import {
  editorActions,
  useEditorPageData,
  useEditorStore,
  useEditorTheme,
} from '#/store/editorStore'
import type { TenantTemplatePageType } from '#/types/cms.type'

import { EditPageDataModal } from '../../-schema'
import type { TemplateData } from '#themes'

const PageSelectorRoot = styled.div`
  padding: 12px 14px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`

const StyledSelect = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 32px 0 10px;
  background-color: #f8fafc;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  appearance: none;
  outline: none;
  transition: all 0.15s ease;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background-color: #f1f5f9;
    border-color: ${theme.colors.primary.DEFAULT};
  }

  &:focus {
    background-color: ${theme.colors.background};
    border-color: ${theme.colors.primary.DEFAULT};
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
`

const SelectChevronIcon = styled.div`
  position: absolute;
  right: 10px;
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${theme.colors.text.secondary};
`

const PageMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.75rem;

  span.slug {
    color: ${theme.colors.text.secondary};
    font-family: monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export interface PageSelectorProps {
  tenantTemplateUuid?: string
  tenantPages?: Array<TenantTemplatePageType>
  onPageChange?: (slug: string) => void
  onRefetchTenantPages?: () => void
  className?: string
}

export const PageSelector: React.FC<PageSelectorProps> = ({
  tenantTemplateUuid,
  tenantPages = [],
  onPageChange,
  onRefetchTenantPages,
  className,
}) => {
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId)
  const storeTenantTemplateUuid = useEditorStore(
    (state) => state.tenantTemplateUuid,
  )
  const effectiveTenantTemplateUuid =
    tenantTemplateUuid || storeTenantTemplateUuid || undefined

  const activeTheme = useEditorTheme()
  const activePageData = useEditorPageData()
  const { templateCatalog } = activeTheme

  const [isEditPageModalOpen, setIsEditPageModalOpen] = useState(false)
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false)

  const handlePageSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextKey = event.target.value
    const matchedPage = tenantPages.find((p) => p.slug === nextKey)

    if (matchedPage) {
      const pageData = {
        uuid: matchedPage.uuid,
        title: matchedPage.title,
        slug: matchedPage.slug,
        is_active: matchedPage.is_active,
      }

      editorActions.setBackendContext(
        effectiveTenantTemplateUuid,
        matchedPage.uuid,
        pageData,
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
        )
      }
      const templateKey = nextKey === 'home' ? 'index' : nextKey
      editorActions.switchTemplate(templateKey)
      onPageChange?.(nextKey)
    } else {
      editorActions.setBackendContext(effectiveTenantTemplateUuid, null, null)
      editorActions.switchTemplate(nextKey)
      onPageChange?.(nextKey)
    }
  }

  const currentSelectValue = activePageData?.slug ?? activeTemplateId

  return (
    <PageSelectorRoot className={className}>
      <HeaderRow>
        <LabelGroup>
          <Layers01Icon size={14} color={theme.colors.primary.DEFAULT} />
          <Typography
            variant="caption"
            weight="bold"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: '0.6875rem',
              color: theme.colors.text.secondary,
            }}
          >
            Halaman
          </Typography>
        </LabelGroup>

        <ActionsGroup>
          {activePageData?.uuid && (
            <IconButton
              size="sm"
              variant="ghost"
              title="Edit Data Halaman"
              onClick={() => setIsEditPageModalOpen(true)}
            >
              <Edit02Icon size={14} />
            </IconButton>
          )}

          {effectiveTenantTemplateUuid && (
            <IconButton
              size="sm"
              variant="ghost"
              title="Buat Halaman Baru"
              onClick={() => setIsCreatePageModalOpen(true)}
            >
              <PlusSignIcon size={14} />
            </IconButton>
          )}
        </ActionsGroup>
      </HeaderRow>

      <SelectWrapper>
        <StyledSelect
          aria-label="Pilih Halaman"
          value={currentSelectValue}
          onChange={handlePageSelectChange}
        >
          {tenantPages.length > 0 ? (
            <>
              <optgroup label="Halaman Toko">
                {tenantPages.map((page) => (
                  <option key={page.uuid} value={page.slug}>
                    {page.title} (/{page.slug})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Template Bawaan">
                {Object.entries(templateCatalog).map(([id, entry]) => (
                  <option key={id} value={id}>
                    {entry.label}
                  </option>
                ))}
              </optgroup>
            </>
          ) : (
            Object.entries(templateCatalog).map(([id, entry]) => (
              <option key={id} value={id}>
                {entry.label}
              </option>
            ))
          )}
        </StyledSelect>
        <SelectChevronIcon>
          <ArrowDown01Icon size={16} />
        </SelectChevronIcon>
      </SelectWrapper>

      {/* Edit Page Data Modal */}
      {isEditPageModalOpen && activePageData?.uuid && (
        <EditPageDataModal
          isOpen={isEditPageModalOpen}
          pageUuid={activePageData.uuid}
          tenantTemplateUuid={effectiveTenantTemplateUuid}
          currentTitle={activePageData.title}
          currentSlug={activePageData.slug}
          isActive={activePageData.is_active}
          onClose={() => setIsEditPageModalOpen(false)}
          onSuccess={(updated) => {
            onRefetchTenantPages?.()
            if (updated.slug !== activePageData.slug) {
              const templateKey =
                updated.slug === 'home' ? 'index' : updated.slug
              editorActions.switchTemplate(templateKey)
              onPageChange?.(updated.slug)
            }
          }}
        />
      )}

      {/* Create New Page Modal */}
      {isCreatePageModalOpen && effectiveTenantTemplateUuid && (
        <CreatePageModal
          isOpen={isCreatePageModalOpen}
          tenantTemplateUuid={effectiveTenantTemplateUuid}
          themeDefinition={activeTheme}
          onClose={() => setIsCreatePageModalOpen(false)}
          onSuccess={(created) => {
            onRefetchTenantPages?.()
            const templateKey = created.slug === 'home' ? 'index' : created.slug
            editorActions.switchTemplate(templateKey)
            onPageChange?.(created.slug)
          }}
        />
      )}
    </PageSelectorRoot>
  )
}
