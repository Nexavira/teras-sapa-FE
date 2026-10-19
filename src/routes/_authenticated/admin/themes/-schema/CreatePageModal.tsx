import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cancel01Icon,
  File01Icon,
  PlusSignIcon,
} from 'hugeicons-react'

import {
  Badge,
  Button,
  Card,
  IconButton,
  theme,
  Typography,
} from '#/-components/ui'
import { TextInput } from '#/-components/ui/form/text-input'
import { useCreateTenantTemplatePage } from '#/services/cms/useCreateTenantTemplatePage'
import type { TenantTemplatePageType } from '#/types/cms.type'

import type { ThemeDefinition } from '#themes'
import type { CreatePageFormValues } from '../-utils/-create-page-schema'
import {
  createPageSchema,
  initialCreatePageFormValues,
} from '../-utils/-create-page-schema'

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
  width: min(580px, 100%);
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
  gap: 18px;
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

const TemplateSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  max-height: 220px;
  overflow-y: auto;
  padding: 2px;
`

const TemplateOptionCard = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid
    ${({ isSelected }) =>
      isSelected ? theme.colors.primary.DEFAULT : theme.colors.border};
  background-color: ${({ isSelected }) =>
    isSelected ? `${theme.colors.primary.DEFAULT}0D` : '#ffffff'};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
  }
`

const TemplatePreviewSections = styled.div`
  background: ${theme.colors.gray[100]};
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SectionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export interface CreatePageModalProps {
  isOpen: boolean
  onClose: () => void
  tenantTemplateUuid: string
  themeDefinition: ThemeDefinition
  onSuccess?: (page: TenantTemplatePageType) => void
}

export const CreatePageModal: React.FC<CreatePageModalProps> = ({
  isOpen,
  onClose,
  tenantTemplateUuid,
  themeDefinition,
  onSuccess,
}) => {
  const createPageMutation = useCreateTenantTemplatePage()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePageFormValues>({
    resolver: zodResolver(createPageSchema),
    defaultValues: initialCreatePageFormValues,
  })

  const selectedTemplateKey = useWatch({ control, name: 'template_key' })
  const catalogEntries = Object.entries(themeDefinition.templateCatalog)

  useEffect(() => {
    if (isOpen) {
      const defaultEntry = catalogEntries[0]
      const defaultKey = defaultEntry ? defaultEntry[0] : ''
      const defaultLabel = defaultEntry ? defaultEntry[1].label : ''
      const defaultSlug =
        defaultKey === 'index'
          ? 'home-baru'
          : defaultKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      reset({
        tenant_template_uuid: tenantTemplateUuid,
        template_key: defaultKey,
        title: defaultLabel,
        slug: defaultSlug,
        is_active: 1,
      })
    }
  }, [isOpen, tenantTemplateUuid, reset])

  if (!isOpen) return null

  const selectedEntry = themeDefinition.templateCatalog[selectedTemplateKey]
  const sectionKeys = selectedEntry?.data?.order || []

  const handleSelectTemplate = (key: string) => {
    const entry = themeDefinition.templateCatalog[key]
    if (!entry) return

    setValue('template_key', key, { shouldValidate: true })
    setValue('title', entry.label, { shouldValidate: true })
    const computedSlug =
      key === 'index'
        ? 'home-page'
        : key.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    setValue('slug', computedSlug, { shouldValidate: true })
  }

  const onSubmit = async (values: CreatePageFormValues) => {
    const templateData =
      themeDefinition.templateCatalog[values.template_key]?.data || null

    const result = await createPageMutation.mutateAsync({
      tenant_template_uuid: values.tenant_template_uuid,
      title: values.title,
      slug: values.slug,
      template_data: templateData,
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
              Buat Halaman dari Template
            </Typography>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <div>
              <Typography variant="body" weight="medium">
                Pilih Template Halaman:
              </Typography>
              <Typography variant="caption" color="secondary">
                Pilih jenis tata letak yang ingin Anda buat untuk website Anda:
              </Typography>
              <TemplateSelectionGrid style={{ marginTop: '8px' }}>
                {catalogEntries.map(([key, entry]) => (
                  <TemplateOptionCard
                    key={key}
                    type="button"
                    isSelected={selectedTemplateKey === key}
                    onClick={() => handleSelectTemplate(key)}
                  >
                    <Typography variant="body" weight="bold">
                      {entry.label}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {entry.data.order.length} seksi bawaan
                    </Typography>
                  </TemplateOptionCard>
                ))}
              </TemplateSelectionGrid>
              {errors.template_key && (
                <Typography
                  variant="caption"
                  color="secondary"
                  style={{ color: theme.colors.error }}
                >
                  {errors.template_key.message}
                </Typography>
              )}
            </div>

            {selectedEntry && (
              <TemplatePreviewSections>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" weight="medium">
                    Seksi bawaan dari template ini ({sectionKeys.length}):
                  </Typography>
                  <Badge size="sm" variant="neutral">
                    {selectedTemplateKey}
                  </Badge>
                </div>
                <SectionChips>
                  {sectionKeys.map((secId) => {
                    const sec = selectedEntry.data.sections[secId]
                    return (
                      <Badge key={secId} size="sm" variant="default">
                        {sec?.type || secId}
                      </Badge>
                    )
                  })}
                </SectionChips>
              </TemplatePreviewSections>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <TextInput
                control={control}
                name="title"
                label="Judul Halaman"
                placeholder="Contoh: Tentang Perusahaan Kami"
              />

              <div>
                <TextInput
                  control={control}
                  name="slug"
                  label="Slug URL Halaman"
                  placeholder="contoh: tentang-kami"
                />
                <Typography
                  variant="caption"
                  color="secondary"
                  style={{ marginTop: '4px', display: 'block' }}
                >
                  URL halaman nantinya akan menjadi /nama-slug
                </Typography>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              color="neutral"
              onClick={onClose}
              disabled={createPageMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              isLoading={createPageMutation.isPending}
              startIcon={<PlusSignIcon size={16} />}
            >
              Buat Halaman
            </Button>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  )
}
