import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
  PaintBoardIcon,
} from 'hugeicons-react'
import { Controller, useForm } from 'react-hook-form'

import {
  Badge,
  Button,
  Card,
  Divider,
  IconButton,
  theme,
  Typography,
} from '#/-components/ui'
import { TextInput } from '#/-components/ui/form/text-input'
import { useUpdateTenantTemplate } from '#/services/cms/useUpdateTenantTemplate'
import {
  editorActions,
  useEditorGlobalSettings,
  useEditorTheme,
} from '#/store/editorStore'
import type { TenantTemplateType } from '#/types/cms.type'

import type { EditThemeDataFormValues } from '../-utils/-edit-theme-schema'
import {
  editThemeDataSchema,
  initialEditThemeDataFormValues,
} from '../-utils/-edit-theme-schema'

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
  width: min(560px, 100%);
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

const InfoCallout = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  background-color: #f8fafc;
  border: 1px solid ${theme.colors.border};
`

const CheckboxCard = styled.label<{ isChecked?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid
    ${({ isChecked }) =>
      isChecked ? theme.colors.primary.DEFAULT : theme.colors.border};
  background-color: ${({ isChecked }) =>
    isChecked ? `${theme.colors.primary.DEFAULT}0A` : '#ffffff'};
  cursor: pointer;
  transition: all 0.15s ease;

  input[type='checkbox'] {
    margin-top: 3px;
    accent-color: ${theme.colors.primary.DEFAULT};
    width: 16px;
    height: 16px;
  }
`

const StatusOptionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const StatusOption = styled.button<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary.DEFAULT : theme.colors.border};
  background-color: ${({ isSelected }) =>
    isSelected ? `${theme.colors.primary.DEFAULT}0D` : '#ffffff'};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.primary.DEFAULT : theme.colors.text.primary};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 500)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
  }
`

export interface EditThemeDataModalProps {
  isOpen: boolean
  onClose: () => void
  tenantTemplateUuid: string
  currentTitle?: string
  isPublished?: boolean
  isActive?: boolean
  onSuccess?: (updated: TenantTemplateType) => void
}

export const EditThemeDataModal: React.FC<EditThemeDataModalProps> = ({
  isOpen,
  onClose,
  tenantTemplateUuid,
  currentTitle = '',
  isPublished = false,
  isActive = true,
  onSuccess,
}) => {
  const activeTheme = useEditorTheme()
  const globalSettings = useEditorGlobalSettings()
  const updateMutation = useUpdateTenantTemplate()

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<EditThemeDataFormValues>({
      resolver: zodResolver(editThemeDataSchema),
      defaultValues: initialEditThemeDataFormValues,
    })

  const formIsActive = watch('is_active')

  useEffect(() => {
    if (isOpen) {
      reset({
        tenant_template_uuid: tenantTemplateUuid,
        theme_title: currentTitle || activeTheme.name,
        active_template: isPublished,
        is_active: isActive ? 1 : 0,
      })
    }
  }, [
    isOpen,
    tenantTemplateUuid,
    currentTitle,
    isPublished,
    isActive,
    activeTheme.name,
    reset,
  ])

  if (!isOpen) return null

  const onSubmit = async (values: EditThemeDataFormValues) => {
    const result = await updateMutation.mutateAsync({
      tenant_template_uuid: values.tenant_template_uuid,
      active_template: values.active_template,
      is_active: values.is_active,
      template_settings: {
        ...globalSettings,
        theme_title: values.theme_title,
        theme_id: activeTheme.id,
      },
    })

    editorActions.setThemeData({
      uuid: values.tenant_template_uuid,
      title: values.theme_title,
      isPublished: values.active_template,
      isActive: values.is_active === 1,
    })

    onSuccess?.(result)
    onClose()
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard padding="none" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PaintBoardIcon size={20} color={theme.colors.primary.DEFAULT} />
            <Typography variant="title" weight="bold">
              Edit Data Tema
            </Typography>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <InfoCallout>
              <Layers01Icon size={20} color={theme.colors.primary.DEFAULT} />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <Typography variant="caption" color="secondary">
                  Base Template: <strong>{activeTheme.name}</strong> (
                  {activeTheme.category})
                </Typography>
                <Typography variant="caption" color="secondary">
                  Pengaturan data tema berlaku untuk seluruh tampilan etalase
                  toko ini.
                </Typography>
              </div>
            </InfoCallout>

            <TextInput
              control={control}
              name="theme_title"
              label="Nama Tema"
              placeholder="Contoh: Toko Utama - Versi 2"
            />

            <div>
              <Typography
                variant="caption"
                weight="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Status Tema
              </Typography>
              <StatusOptionRow>
                <StatusOption
                  type="button"
                  isSelected={formIsActive === 1}
                  onClick={() =>
                    setValue('is_active', 1, { shouldValidate: true })
                  }
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                    }}
                  />
                  Aktif (Enabled)
                </StatusOption>
                <StatusOption
                  type="button"
                  isSelected={formIsActive === 0}
                  onClick={() =>
                    setValue('is_active', 0, { shouldValidate: true })
                  }
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#94a3b8',
                    }}
                  />
                  Nonaktif (Disabled)
                </StatusOption>
              </StatusOptionRow>
            </div>

            <Divider />

            <Controller
              control={control}
              name="active_template"
              render={({ field }) => (
                <CheckboxCard isChecked={field.value}>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Typography variant="body" weight="bold">
                        Jadikan Active Theme (Live di Toko)
                      </Typography>
                      {field.value && (
                        <Badge size="sm" variant="success">
                          Live
                        </Badge>
                      )}
                    </div>
                    <Typography variant="caption" color="secondary">
                      Jika dicentang, tema ini akan menjadi tema utama yang
                      tampil saat pengunjung membuka website toko Anda.
                    </Typography>
                  </div>
                </CheckboxCard>
              )}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              color="neutral"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isLoading={updateMutation.isPending}
              startIcon={<CheckmarkCircle02Icon size={16} />}
            >
              Simpan Perubahan
            </Button>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  )
}
