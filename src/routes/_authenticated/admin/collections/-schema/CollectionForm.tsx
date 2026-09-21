import { useEffect } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '#/-components/ui/primitives/Button'
import { Card } from '#/-components/ui/primitives/Card'
import { theme } from '#/-components/ui/theme'
import type { Collection } from '#/types/collection.type'

import type { CollectionFormValues } from '../-utils/-collection-schema'
import {
  collectionSchema,
  createCollectionSlug,
  initialCollectionFormValues,
} from '../-utils/-collection-schema'
import { CollectionGeneralInfo } from './CollectionGeneralInfo'
import { CollectionProductPicker } from './CollectionProductPicker'

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

const FormActionsCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 24px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
`

export interface CollectionFormProps {
  initialData?: Collection | null
  onSubmit: (data: CollectionFormValues) => void | Promise<void>
  isSubmitting?: boolean
  onCancel?: () => void
}

export const CollectionForm = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: CollectionFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting: formIsSubmitting },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema) as any,
    defaultValues: initialCollectionFormValues,
  })

  const title = useWatch({ control, name: 'title' })

  useEffect(() => {
    if (initialData) {
      reset({
        uuid: initialData.uuid,
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description || '',
        image: initialData.image || '',
        productUuids: initialData.productUuids || [],
      })
    } else {
      reset(initialCollectionFormValues)
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!initialData && title) {
      setValue('slug', createCollectionSlug(title))
    }
  }, [title, initialData, setValue])

  const pending = isSubmitting || formIsSubmitting

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <CollectionGeneralInfo control={control} />
      <CollectionProductPicker control={control} setValue={setValue} />

      <FormActionsCard>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="solid"
          color="primary"
          disabled={pending}
        >
          {pending
            ? 'Saving...'
            : initialData
              ? 'Update Collection'
              : 'Save Collection'}
        </Button>
      </FormActionsCard>
    </FormContainer>
  )
}
