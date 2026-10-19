import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
  SparklesIcon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  Divider,
  IconButton,
  Input,
  theme,
  Typography,
} from '#/-components/ui'
import { useCreateTenantTemplate } from '#/services/cms/useCreateTenantTemplate'
import type { TenantTemplateType } from '#/types/cms.type'
import type { TenantType } from '#/types/tenant.type'

import type { ThemeDefinition } from '#themes'
import type { InstallThemeFormValues } from '../-utils/-install-theme-schema'
import {
  initialInstallThemeFormValues,
  installThemeSchema,
} from '../-utils/-install-theme-schema'

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`

const ModalCard = styled(Card)`
  width: min(600px, 100%);
  max-height: 90vh;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
`

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`

const InfoBox = styled.div`
  background: ${theme.colors.gray[100]};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const PagesListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 6px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const PageTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid ${theme.colors.border};
  font-size: 0.8125rem;
  color: ${theme.colors.text.primary};
`

const ActivationOption = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary.DEFAULT : theme.colors.border};
  background-color: ${({ isSelected }) =>
    isSelected ? `${theme.colors.primary.DEFAULT}08` : '#ffffff'};
  cursor: pointer;
  transition: all 0.15s ease;

  input[type='checkbox'] {
    margin-top: 3px;
    accent-color: ${theme.colors.primary.DEFAULT};
    width: 16px;
    height: 16px;
  }
`

export interface InstallThemeModalProps {
  isOpen: boolean
  onClose: () => void
  themeDefinition: ThemeDefinition | null
  globalTemplateUuid?: string
  tenant: TenantType
  hasActiveTheme?: boolean
  onSuccess?: (created: TenantTemplateType) => void
}

export const InstallThemeModal: React.FC<InstallThemeModalProps> = ({
  isOpen,
  onClose,
  themeDefinition,
  globalTemplateUuid,
  tenant,
  hasActiveTheme = false,
  onSuccess,
}) => {
  const createMutation = useCreateTenantTemplate()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InstallThemeFormValues>({
    resolver: zodResolver(installThemeSchema),
    defaultValues: initialInstallThemeFormValues,
  })

  useEffect(() => {
    if (isOpen && themeDefinition) {
      reset({
        tenant_uuid: tenant.uuid,
        global_template_uuid: globalTemplateUuid || '',
        theme_id: themeDefinition.id,
        name: themeDefinition.name,
        // If there's no active theme yet, set as active by default, otherwise default to draft
        active_template: !hasActiveTheme,
        is_active: 1,
        include_default_pages: true,
      })
    }
  }, [isOpen, themeDefinition, tenant.uuid, globalTemplateUuid, hasActiveTheme, reset])

  if (!isOpen || !themeDefinition) return null

  const catalogEntries = Object.entries(themeDefinition.templateCatalog)
  const activeTemplateSelected = watch('active_template')

  const onSubmit = async (values: InstallThemeFormValues) => {
    const pagesPayload = catalogEntries.map(([key, entry]) => ({
      title: entry.label,
      slug: key === 'index' ? 'home' : key,
      template_data: entry.data,
      is_active: 1,
    }))

    const result = await createMutation.mutateAsync({
      tenant_uuid: tenant.uuid,
      global_template_uuid: globalTemplateUuid || undefined,
      active_template: values.active_template,
      is_active: 1,
      template_settings: {
        ...themeDefinition.defaultSettingsData,
        theme_title: values.name || themeDefinition.name,
        theme_id: themeDefinition.id,
      },
      pages: pagesPayload,
    })

    onSuccess?.(result)
    onClose()
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard padding="none" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers01Icon size={20} color={theme.colors.primary.DEFAULT} />
            <Typography variant="title" weight="bold">
              Add to Theme Library
            </Typography>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div>
              <Typography variant="body" color="secondary">
                Tema <strong>{themeDefinition.name}</strong> akan ditambahkan ke
                theme library store <strong>{tenant.name}</strong>.
              </Typography>
            </div>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  label="Nama Tema di Library"
                  placeholder="Contoh: Forge Manufacturing - Main Store"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="active_template"
              render={({ field }) => (
                <ActivationOption isSelected={field.value}>
                  <input
                    type="checkbox"
                    id="active_template"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <div>
                    <Typography variant="body" weight="medium">
                      Set langsung sebagai Active Theme
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {field.value
                        ? 'Tema ini akan langsung aktif dan live di store kamu menggantikan tema saat ini.'
                        : 'Tema akan disimpan sebagai draft di theme library. Kamu bisa customize dulu sebelum dipublish.'}
                    </Typography>
                  </div>
                </ActivationOption>
              )}
            />

            <InfoBox>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body" weight="bold">
                  Default Pages yang Disiapkan ({catalogEntries.length})
                </Typography>
                <Badge variant="success">Schema Ready</Badge>
              </div>
              <Typography variant="caption" color="secondary">
                Halaman-halaman ini otomatis di-generate lengkap dengan sections
                dan block awal dari template:
              </Typography>
              <PagesListGrid>
                {catalogEntries.map(([key, entry]) => (
                  <PageTag key={key}>
                    <CheckmarkCircle02Icon
                      size={15}
                      color={theme.colors.success}
                    />
                    <span>
                      {entry.label}{' '}
                      <span style={{ color: theme.colors.text.secondary }}>
                        (/{key === 'index' ? 'home' : key})
                      </span>
                    </span>
                  </PageTag>
                ))}
              </PagesListGrid>
            </InfoBox>

            <Divider />
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              color="neutral"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isLoading={createMutation.isPending}
              startIcon={<SparklesIcon size={16} />}
            >
              {activeTemplateSelected
                ? 'Install & Publish'
                : 'Add to Theme Library'}
            </Button>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  )
}
