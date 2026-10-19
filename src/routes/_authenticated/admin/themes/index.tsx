import React, { useRef, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import styled from '@emotion/styled'
import {
  ArrowUpRight01Icon,
  Layers01Icon,
  PaintBoardIcon,
  Store01Icon,
} from 'hugeicons-react'

import { Button, Card, PageHeader, Typography } from '#/-components/ui'
import { theme as adminTheme } from '#/-components/ui/theme'
import { useGetGlobalTemplates } from '#/services/cms/useGetGlobalTemplates'
import { useGetTenantTemplates } from '#/services/cms/useGetTenantTemplates'
import { useGetCurrentTenant } from '#/services/tenant/useGetCurrentTenant'
import type { TenantTemplateType } from '#/types/cms.type'

import { CurrentThemeCard, ThemeCatalogCard, ThemeLibrary } from './-components'
import { InstallThemeModal, PublishConfirmModal } from './-schema'
import type { ThemeDefinition } from '#themes'
import { DEFAULT_THEME_ID, getTheme, themeRegistry } from '#themes'

const Page = styled.div`
  display: flex;
  width: min(1200px, 100%);
  margin: 0 auto;
  flex-direction: column;
  gap: 36px;
  padding-bottom: 48px;
`

const SectionBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const BannerCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid ${adminTheme.colors.border};

  svg {
    flex: 0 0 auto;
    color: ${adminTheme.colors.primary.DEFAULT};
  }
`

export const ThemesPage = () => {
  const catalogRef = useRef<HTMLDivElement>(null)
  const { tenant } = useGetCurrentTenant()
  const { data: globalTemplates = [] } = useGetGlobalTemplates()
  const { data: tenantTemplates = [], refetch: refetchTenantTemplates } =
    useGetTenantTemplates(tenant?.uuid)

  const [installModalState, setInstallModalState] = useState<{
    isOpen: boolean
    theme: ThemeDefinition | null
    globalTemplateUuid?: string
  }>({
    isOpen: false,
    theme: null,
  })

  const [publishModalState, setPublishModalState] = useState<{
    isOpen: boolean
    template: TenantTemplateType | null
  }>({
    isOpen: false,
    template: null,
  })

  const availableThemes = Object.values(themeRegistry)

  // Find active tenant template (only 1 is active)
  const activeTenantTemplate = tenantTemplates.find(
    (item) => !!item.active_template,
  )

  const effectiveTenant =
    tenant ?? (activeTenantTemplate?.tenant as typeof tenant) ?? null

  // Determine which local theme corresponds to the active template
  const activeThemeCustomSettings = activeTenantTemplate?.template_settings as
    Record<string, unknown> | undefined

  const activeThemeId =
    (activeThemeCustomSettings?.theme_id as string) ||
    (activeTenantTemplate?.global_template?.title
      .toLowerCase()
      .includes('forge')
      ? 'forge'
      : activeTenantTemplate?.global_template?.title
            .toLowerCase()
            .includes('dawn')
        ? 'dawn'
        : DEFAULT_THEME_ID)

  const activeThemeDefinition = getTheme(activeThemeId)

  const handleOpenInstall = (
    themeDef: ThemeDefinition,
    globalTemplateUuid?: string,
  ) => {
    setInstallModalState({
      isOpen: true,
      theme: themeDef,
      globalTemplateUuid,
    })
  }

  const handlePublishClick = (template: TenantTemplateType) => {
    setPublishModalState({
      isOpen: true,
      template,
    })
  }

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Page>
      {/* 1. CURRENT THEME / TEMA SAAT INI (Shopify Model) */}
      <SectionBlock>
        <SectionHeader>
          <PageHeader
            title="Current Theme"
            description="Tema yang saat ini aktif dan sedang live dikunjungi oleh customer store Anda."
          />
        </SectionHeader>

        {activeTenantTemplate ? (
          <CurrentThemeCard
            tenantTemplate={activeTenantTemplate}
            themeDefinition={activeThemeDefinition}
          />
        ) : (
          <BannerCard>
            <Layers01Icon size={24} />
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              <Typography variant="body" weight="bold">
                Belum Ada Active Theme
              </Typography>
              <Typography variant="caption" color="secondary">
                Pilih tema dari Theme Catalog di bawah untuk mengaktifkan
                etalase store Anda.
              </Typography>
            </div>
          </BannerCard>
        )}
      </SectionBlock>

      {/* 2. THEME LIBRARY / PUSTAKA TEMA (Shopify Model: multiple can exist, only 1 is active) */}
      <SectionBlock>
        <ThemeLibrary
          tenantTemplates={tenantTemplates}
          onPublish={handlePublishClick}
          onScrollToCatalog={handleScrollToCatalog}
        />
      </SectionBlock>

      {/* 3. THEME CATALOG / JELAJAHI TEMA (Shopify Model: explore & add to library) */}
      <SectionBlock ref={catalogRef}>
        <SectionHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PaintBoardIcon
              size={18}
              color={adminTheme.colors.primary.DEFAULT}
            />
            <Typography as="h2" variant="title" weight="bold">
              Explore Themes
            </Typography>
          </div>
          <Typography variant="body" color="secondary">
            Pilih dan tambahkan tema baru ke theme library Anda. Semua schema
            komponen, setting warna, dan default pages akan otomatis disiapkan.
          </Typography>
        </SectionHeader>

        <ThemeGrid>
          {availableThemes.map((item) => {
            const matchingGlobal = globalTemplates.find(
              (gt) =>
                gt.slug === item.id ||
                gt.title.toLowerCase().includes(item.id.toLowerCase()),
            )

            const isThisThemeActive =
              activeTenantTemplate &&
              (activeThemeDefinition.id === item.id ||
                activeTenantTemplate.global_template?.uuid ===
                  matchingGlobal?.uuid)

            const installedCount = tenantTemplates.filter(
              (t) =>
                t.global_template?.uuid === matchingGlobal?.uuid ||
                (t.template_settings as Record<string, unknown> | undefined)
                  ?.theme_id === item.id,
            ).length

            return (
              <ThemeCatalogCard
                key={item.id}
                globalTemplateUuid={matchingGlobal?.uuid}
                installedCount={installedCount}
                recommended={item.id === DEFAULT_THEME_ID}
                theme={item}
                onInstall={() => handleOpenInstall(item, matchingGlobal?.uuid)}
              />
            )
          })}
        </ThemeGrid>
      </SectionBlock>

      {/* Install Theme Modal */}
      {effectiveTenant && (
        <InstallThemeModal
          globalTemplateUuid={installModalState.globalTemplateUuid}
          hasActiveTheme={Boolean(activeTenantTemplate)}
          isOpen={installModalState.isOpen}
          tenant={effectiveTenant}
          themeDefinition={installModalState.theme}
          onClose={() =>
            setInstallModalState({
              isOpen: false,
              theme: null,
            })
          }
          onSuccess={() => {
            void refetchTenantTemplates()
          }}
        />
      )}

      {/* Publish Confirm Modal */}
      {publishModalState.template && (
        <PublishConfirmModal
          currentActiveThemeName={
            activeTenantTemplate?.global_template?.title ||
            activeThemeDefinition.name
          }
          isOpen={publishModalState.isOpen}
          tenantTemplateUuid={publishModalState.template.uuid}
          themeName={
            ((
              publishModalState.template.template_settings as
                Record<string, unknown> | undefined
            )?.theme_title as string) ||
            publishModalState.template.global_template?.title ||
            'Tema'
          }
          onClose={() =>
            setPublishModalState({
              isOpen: false,
              template: null,
            })
          }
          onSuccess={() => {
            void refetchTenantTemplates()
          }}
        />
      )}
    </Page>
  )
}

export const Route = createFileRoute('/_authenticated/admin/themes/')({
  head: () => ({
    meta: [{ title: 'Themes | Teras Sapa' }],
  }),
  component: ThemesPage,
})
