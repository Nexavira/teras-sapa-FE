import styled from '@emotion/styled'
import type { Control } from 'react-hook-form'

import { ImagePickerInput } from '#/-components/ui/form/image-picker-input'
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

interface ProductMediaProps {
  control: Control<ProductFormValues>
}

export const ProductMedia = ({ control }: ProductMediaProps) => {
  return (
    <SectionCard>
      <SectionHeader>
        <Typography
          variant="title"
          style={{ fontSize: '1.1rem', fontWeight: 700 }}
        >
          Media & Gambar Produk
        </Typography>
        <Typography variant="caption" color="secondary">
          Kelola foto untuk kartu katalog dan tampilan detail produk di toko
          online.
        </Typography>
      </SectionHeader>

      <FormGroup>
        <ImagePickerInput
          control={control}
          name="images.0"
          label="Foto Produk Utama"
          placeholder="Pilih atau unggah foto produk..."
          helperText="Pilih dari pustaka media atau unggah foto baru untuk produk ini."
        />
      </FormGroup>
    </SectionCard>
  )
}
