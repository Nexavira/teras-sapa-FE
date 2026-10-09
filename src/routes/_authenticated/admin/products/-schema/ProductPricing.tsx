import styled from '@emotion/styled'
import type { Control, UseFormRegister } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
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
    ${({ columns = 4 }) => columns},
    minmax(0, 1fr)
  );
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
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

interface ProductPricingProps {
  control: Control<ProductFormValues>
  register: UseFormRegister<ProductFormValues>
}

export const ProductPricing = ({ control, register }: ProductPricingProps) => {
  return (
    <SectionCard>
      <SectionHeader>
        <Typography
          variant="title"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          Harga & Ketersediaan
        </Typography>
        <Typography variant="caption" color="secondary">
          Atur harga dasar, harga promosi (coret), dan status produk.
        </Typography>
      </SectionHeader>

      <FieldGrid columns={4}>
        <TextInput
          control={control}
          name="basePrice"
          label="Harga Dasar ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
        />
        <TextInput
          control={control}
          name="compareAtPrice"
          label="Harga Coret ($)"
          type="number"
          step="0.01"
          placeholder="0.00"
        />
        <FormGroup>
          <Label>Status</Label>
          <Select {...register('status')}>
            <option value="active">Aktif (Diterbitkan)</option>
            <option value="draft">Draf</option>
            <option value="archived">Diarsipkan</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Tipe Produk</Label>
          <Select {...register('type')}>
            <option value="physical">Produk Fisik</option>
            <option value="digital">Produk Digital</option>
          </Select>
        </FormGroup>
      </FieldGrid>
    </SectionCard>
  )
}
