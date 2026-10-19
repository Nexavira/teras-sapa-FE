import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from 'hugeicons-react'

import {
  Button,
  Card,
  Divider,
  IconButton,
  theme,
  Typography,
} from '#/-components/ui'
import { useUpdateTenantTemplate } from '#/services/cms/useUpdateTenantTemplate'

import type { PublishThemeFormValues } from '../-utils/-publish-theme-schema'
import {
  initialPublishThemeFormValues,
  publishThemeSchema,
} from '../-utils/-publish-theme-schema'

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
  width: min(520px, 100%);
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const NoticeBox = styled.div`
  background-color: #f8fafc;
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

export interface PublishConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  tenantTemplateUuid: string
  themeName: string
  currentActiveThemeName?: string
  onSuccess?: () => void
}

export const PublishConfirmModal: React.FC<PublishConfirmModalProps> = ({
  isOpen,
  onClose,
  tenantTemplateUuid,
  themeName,
  currentActiveThemeName,
  onSuccess,
}) => {
  const updateMutation = useUpdateTenantTemplate()

  const { handleSubmit, reset } = useForm<PublishThemeFormValues>({
    resolver: zodResolver(publishThemeSchema),
    defaultValues: initialPublishThemeFormValues,
  })

  useEffect(() => {
    if (isOpen && tenantTemplateUuid) {
      reset({
        tenant_template_uuid: tenantTemplateUuid,
      })
    }
  }, [isOpen, tenantTemplateUuid, reset])

  if (!isOpen) return null

  const onSubmit = async (values: PublishThemeFormValues) => {
    await updateMutation.mutateAsync({
      tenant_template_uuid: values.tenant_template_uuid,
      active_template: true,
    })

    onSuccess?.()
    onClose()
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard padding="none" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckmarkCircle02Icon
              size={20}
              color={theme.colors.primary.DEFAULT}
            />
            <Typography variant="title" weight="bold">
              Publish Theme
            </Typography>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose}>
            <Cancel01Icon size={18} />
          </IconButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Typography variant="body">
              Kamu yakin ingin mempublikasikan tema{' '}
              <strong>{themeName}</strong> sebagai tema aktif di store kamu?
            </Typography>

            <NoticeBox>
              <AlertCircleIcon
                size={20}
                color={theme.colors.text.secondary}
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <Typography variant="body" weight="medium">
                  {currentActiveThemeName
                    ? `Menggantikan: ${currentActiveThemeName}`
                    : 'Akan menjadi Active Theme store'}
                </Typography>
                <Typography variant="caption" color="secondary">
                  Tema lama kamu tidak akan hilang. Tema tersebut akan otomatis
                  dipindahkan ke Theme Library sebagai draft dan bisa kamu
                  publish kembali sewaktu-waktu.
                </Typography>
              </div>
            </NoticeBox>

            <Divider />
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
              Publish Sekarang
            </Button>
          </ModalFooter>
        </form>
      </ModalCard>
    </ModalOverlay>
  )
}
