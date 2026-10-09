import { useEffect } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '#/-components/ui/primitives/Button'
import { Card } from '#/-components/ui/primitives/Card'
import { theme } from '#/-components/ui/theme'
import type { Product } from '#/types/product.type'

import type { ProductFormValues } from '../-utils/-product-schema'
import {
  createSlug,
  initialProductFormValues,
  productSchema,
} from '../-utils/-product-schema'
import { ProductGeneralInfo } from './ProductGeneralInfo'
import { ProductMedia } from './ProductMedia'
import { ProductPricing } from './ProductPricing'
import { ProductVariants } from './ProductVariants'

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

export interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: ProductFormValues) => void | Promise<void>
  isSubmitting?: boolean
  onCancel?: () => void
}

export const ProductForm = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: ProductFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { isSubmitting: formIsSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialProductFormValues,
  })

  const name = useWatch({ control, name: 'name' })

  useEffect(() => {
    if (initialData) {
      reset({
        uuid: initialData.uuid,
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || '',
        status: initialData.status,
        type: initialData.type,
        basePrice: initialData.basePrice,
        compareAtPrice: initialData.compareAtPrice,
        images: initialData.images || [],
        category: initialData.category || 'General',
        vendor: initialData.vendor || '',
        tags: initialData.tags || [],
        variants: (initialData.variants || []).map((v) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          priceOverride: v.priceOverride,
          stockQuantity: v.stockQuantity,
        })),
      })
    } else {
      reset(initialProductFormValues)
    }
  }, [initialData, reset])

  useEffect(() => {
    if (!initialData && name) {
      setValue('slug', createSlug(name))
    }
  }, [name, initialData, setValue])

  const pending = isSubmitting || formIsSubmitting

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <ProductGeneralInfo control={control} register={register} />
      <ProductPricing control={control} register={register} />
      <ProductMedia control={control} />
      <ProductVariants control={control} />

      <FormActionsCard>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button
          type="submit"
          variant="solid"
          color="primary"
          disabled={pending}
        >
          {pending
            ? 'Menyimpan...'
            : initialData
              ? 'Perbarui Produk'
              : 'Simpan Produk'}
        </Button>
      </FormActionsCard>
    </FormContainer>
  )
}
