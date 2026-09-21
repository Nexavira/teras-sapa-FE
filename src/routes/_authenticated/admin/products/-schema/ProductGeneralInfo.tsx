import styled from '@emotion/styled'
import type { Control, UseFormRegister } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { TextareaInput } from '#/-components/ui/form/textarea-input'
import { Card } from '#/-components/ui/primitives/Card'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'

import type { ProductFormValues } from '../-utils/-product-schema'

const SectionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
`

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`

const FieldGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columns = 2 }) => columns},
    minmax(0, 1fr)
  );
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  color: ${theme.colors.text.primary};
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`

const Select = styled.select`
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: ${theme.colors.white};
  color: ${theme.colors.text.primary};
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.primary.DEFAULT};
  }
`

interface ProductGeneralInfoProps {
  control: Control<ProductFormValues>
  register: UseFormRegister<ProductFormValues>
}

export const ProductGeneralInfo = ({
  control,
  register,
}: ProductGeneralInfoProps) => {
  return (
    <SectionCard>
      <SectionHeader>
        <Typography
          variant="title"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          General Details
        </Typography>
        <Typography variant="caption" color="secondary">
          Basic information that describes your product across your catalog.
        </Typography>
      </SectionHeader>

      <FieldGrid columns={2}>
        <TextInput
          control={control}
          name="name"
          label="Product Title"
          placeholder="e.g. Washed Linen Overshirt"
        />
        <TextInput
          control={control}
          name="slug"
          label="Handle / Slug"
          placeholder="e.g. washed-linen-overshirt"
        />
      </FieldGrid>

      <TextareaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Provide detail on materials, fit, and craftsmanship..."
        rows={3}
      />

      <FieldGrid columns={2}>
        <FormGroup>
          <Label>Category</Label>
          <Select {...register('category')}>
            <option value="Apparel">Apparel</option>
            <option value="Accessories">Accessories</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Stationery">Stationery</option>
            <option value="General">General</option>
          </Select>
        </FormGroup>

        <TextInput
          control={control}
          name="vendor"
          label="Vendor / Brand"
          placeholder="e.g. Serein Studio"
        />
      </FieldGrid>
    </SectionCard>
  )
}
