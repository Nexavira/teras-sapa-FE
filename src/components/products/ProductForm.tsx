import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '#/components/ui'
import { TextInput } from '#/components/ui/form'
import type { CreateProductInput } from '#/services/products/productSchemas'
import { createProductSchema } from '#/services/products/productSchemas'

import { VariantBuilder } from './VariantBuilder'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Label = styled.label`
  font-weight: 500;
  font-size: 0.875rem;
`

interface ProductFormProps {
  onSubmit: (data: CreateProductInput) => void
  isLoading?: boolean
}

export const ProductForm = ({ onSubmit, isLoading }: ProductFormProps) => {
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      slug: '',
      type: 'physical',
      status: 'draft',
      basePrice: '',
      variants: [],
      attributes: {},
    },
  })

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <TextInput
          control={methods.control}
          name="name"
          label="Name"
          placeholder="Product Name"
        />
        <TextInput
          control={methods.control}
          name="slug"
          label="Slug"
          placeholder="product-slug"
        />
        <TextInput
          control={methods.control}
          name="basePrice"
          label="Base Price"
          placeholder="0.00"
          type="number"
          step="0.01"
        />

        <FormGroup>
          <Label>Type</Label>
          <select
            {...methods.register('type')}
            style={{ padding: '8px', borderRadius: '6px' }}
          >
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </select>
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <select
            {...methods.register('status')}
            style={{ padding: '8px', borderRadius: '6px' }}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </FormGroup>

        <VariantBuilder />

        <Button
          type="submit"
          disabled={isLoading}
          style={{ marginTop: '24px', width: 'fit-content' }}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </Form>
    </FormProvider>
  )
}
