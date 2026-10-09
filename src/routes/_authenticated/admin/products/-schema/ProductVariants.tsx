import styled from '@emotion/styled'
import { Delete02Icon, PlusSignIcon } from 'hugeicons-react'
import type { Control } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { ActionIconButton } from '#/-components/ui/primitives/ActionIconButton'
import { Button } from '#/-components/ui/primitives/Button'
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
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`

const VariantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VariantRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.paper};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

interface ProductVariantsProps {
  control: Control<ProductFormValues>
}

export const ProductVariants = ({ control }: ProductVariantsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  })

  const handleAddVariant = () => {
    append({
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name: 'Opsi Standar',
      stockQuantity: 10,
      priceOverride: null,
    })
  }

  return (
    <SectionCard>
      <SectionHeader>
        <div>
          <Typography
            variant="title"
            style={{ fontSize: '1.1rem', fontWeight: 700 }}
          >
            Varian Produk ({fields.length})
          </Typography>
          <Typography variant="caption" color="secondary">
            Kelola SKU, ukuran, warna, dan jumlah stok varian.
          </Typography>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddVariant}
        >
          <PlusSignIcon size={14} /> Tambah Varian
        </Button>
      </SectionHeader>

      {fields.length === 0 ? (
        <Typography
          variant="caption"
          color="muted"
          style={{ fontStyle: 'italic', padding: '12px 0' }}
        >
          Belum ada varian yang ditentukan. Harga dasar dan stok tunggal standar
          yang akan berlaku.
        </Typography>
      ) : (
        <VariantsList>
          {fields.map((field, index) => (
            <VariantRow key={field.id}>
              <TextInput
                control={control}
                name={`variants.${index}.sku`}
                placeholder="Kode SKU"
              />
              <TextInput
                control={control}
                name={`variants.${index}.name`}
                placeholder="Opsi (misal: Ukuran M, Biru)"
              />
              <TextInput
                control={control}
                name={`variants.${index}.stockQuantity`}
                type="number"
                placeholder="Stok"
              />
              <TextInput
                control={control}
                name={`variants.${index}.priceOverride`}
                type="number"
                step="0.01"
                placeholder="Harga ($)"
              />
              <ActionIconButton
                danger
                onClick={() => remove(index)}
                title="Hapus Varian"
                aria-label="Hapus Varian"
              >
                <Delete02Icon size={16} />
              </ActionIconButton>
            </VariantRow>
          ))}
        </VariantsList>
      )}
    </SectionCard>
  )
}
