import React, { useEffect } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  LinkSquare02Icon,
} from 'hugeicons-react'
import { useForm, useWatch } from 'react-hook-form'

import {
  Button,
  Card,
  Divider,
  IconButton,
  theme,
  Typography,
} from '#/-components/ui'
import { TextInput } from '#/-components/ui/form/text-input'
import { useUpdateTenantTemplatePage } from '#/services/cms/useUpdateTenantTemplatePage'
import { editorActions, useEditorTemplate } from '#/store/editorStore'
import type { TenantTemplatePageType } from '#/types/cms.type'

import type { EditPageDataFormValues } from '../-utils/-edit-page-schema'
import {
  editPageDataSchema,
  initialEditPageDataFormValues,
} from '../-utils/-edit-page-schema'

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
  width: min(540px, 100%);
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

const UrlPreviewBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid ${theme.colors.border};
  font-family: monospace;
  font-size: 0.8125rem;
  color: ${theme.colors.text.secondary};

  span.path {
    color: ${theme.colors.primary.DEFAULT};
    font-weight: 600;
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

export interface EditPageDataModalProps {
  isOpen: boolean
  onClose: () => void
  pageUuid: string
  tenantTemplateUuid?: string
  currentTitle?: string
  currentSlug?: string
  isActive?: number | boolean
  onSuccess?: (updated: TenantTemplatePageType) => void
}

export const EditPageDataModal: React.FC<EditPageDataModalProps> = ({
  isOpen,
  onClose,
  pageUuid,
  tenantTemplateUuid,
  currentTitle = '',
  currentSlug = '',
  isActive = 1,
  onSuccess,
}) => {
  const currentTemplate = useEditorTemplate()
  const updatePageMutation = useUpdateTenantTemplatePage()

  const { control, handleSubmit, reset, setValue } =
    useForm<EditPageDataFormValues>({
      resolver: zodResolver(editPageDataSchema),
      defaultValues: initialEditPageDataFormValues,
    })

  const formSlug = useWatch({ control, name: 'slug' })
  const formIsActive = useWatch({ control, name: 'is_active' })

  useEffect(() => {
    if (isOpen) {
      reset({
        tenant_template_page_uuid: pageUuid,
        tenant_template_uuid: tenantTemplateUuid,
        title: currentTitle,
        slug: currentSlug,
        is_active:
          typeof isActive === 'boolean' ? (isActive ? 1 : 0) : isActive,
      })
    }
  }, [
    isOpen,
    pageUuid,
    tenantTemplateUuid,
    currentTitle,
    currentSlug,
    isActive,
    reset,
  ])

  if (!isOpen) return null

  const onSubmit = async (values: EditPageDataFormValues) => {
    const result = await updatePageMutation.mutateAsync({
      tenant_template_page_uuid: values.tenant_template_page_uuid,
      tenant_template_uuid: values.tenant_template_uuid,
      title: values.title,
      slug: values.slug,
      template_data: currentTemplate as unknown as Record<string, unknown>,
      is_active: values.is_active,
    })

    editorActions.setActivePageData({
      uuid: values.tenant_template_page_uuid,
      title: values.title,
      slug: values.slug,
      is_active: values.is_active,
    })

    onSuccess?.(result)
    onClose()
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard padding="none" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <File01Icon size={20} color={theme.colors.primary.DEFAULT} />
            <Typography variant="title" weight="bold">
              Edit Data Halaman
            </Typography>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <TextInput
              control={control}
              name="title"
              label="Judul Halaman"
              placeholder="Contoh: Tentang Toko Kami"
            />

            <div>
              <TextInput
                control={control}
                name="slug"
                label="Slug URL Halaman"
                placeholder="contoh: tentang-kami"
              />
              <div style={{ marginTop: '8px' }}>
                <UrlPreviewBox>
                  <LinkSquare02Icon size={14} />
                  <span>Preview URL:</span>
                  <span className="path">/{formSlug || 'slug'}</span>
                </UrlPreviewBox>
              </div>
            </div>

            <Divider />

            <div>
              <Typography
                variant="caption"
                weight="medium"
                style={{ marginBottom: '8px', display: 'block' }}
              >
                Status Halaman
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
                  Aktif (Terbit)
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
                  Nonaktif (Draf)
                </StatusOption>
              </StatusOptionRow>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              color="neutral"
              onClick={onClose}
              disabled={updatePageMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isLoading={updatePageMutation.isPending}
              startIcon={<CheckmarkCircle02Icon size={16} />}
            >
              Simpan Data Halaman
            </Button>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  )
}
