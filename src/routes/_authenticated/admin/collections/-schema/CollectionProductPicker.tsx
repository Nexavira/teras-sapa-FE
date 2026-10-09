import { useState } from 'react'

import styled from '@emotion/styled'
import {
  CheckmarkSquare02Icon,
  Delete02Icon,
  Search01Icon,
  SquareIcon,
} from 'hugeicons-react'
import type { Control, UseFormSetValue } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { Badge } from '#/-components/ui/primitives/Badge'
import { Button } from '#/-components/ui/primitives/Button'
import { Card } from '#/-components/ui/primitives/Card'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'
import { useGetProducts } from '#/services/product/useGetProducts'

import type { CollectionFormValues } from '../-utils/-collection-schema'

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

const SelectedPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const SelectedPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1px solid rgba(0, 168, 107, 0.3);
  border-radius: 999px;
  background: rgba(0, 168, 107, 0.08);
  color: ${theme.colors.primary.DARKER};
  font-size: 0.82rem;
  font-weight: 600;

  button {
    display: grid;
    place-items: center;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: ${theme.colors.primary.DARKER};
    opacity: 0.7;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 1;
    }
  }
`

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  svg {
    position: absolute;
    left: 14px;
    color: ${theme.colors.muted};
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 42px;
    padding: 0 14px 0 42px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    background: ${theme.colors.paper};
    color: ${theme.colors.text.primary};
    font-size: 0.88rem;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: ${theme.colors.primary.DEFAULT};
      background: ${theme.colors.white};
    }
  }
`

const ProductPickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.paper};
`

const ProductPickerItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? theme.colors.primary.DEFAULT : 'transparent'};
  border-radius: 8px;
  background: ${({ $selected }) =>
    $selected ? `${theme.colors.primary.DEFAULT}0d` : theme.colors.white};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.primary.DEFAULT};
  }
`

const ProductItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 44px;
    height: 44px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid ${theme.colors.border};
    flex-shrink: 0;
  }
`

const CheckboxIcon = styled.div<{ $checked: boolean }>`
  display: grid;
  place-items: center;
  color: ${({ $checked }) =>
    $checked ? theme.colors.primary.DEFAULT : theme.colors.muted};
`

interface CollectionProductPickerProps {
  control: Control<CollectionFormValues>
  setValue: UseFormSetValue<CollectionFormValues>
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&auto=format&fit=crop&q=80'

export const CollectionProductPicker = ({
  control,
  setValue,
}: CollectionProductPickerProps) => {
  const { data: allProducts = [] } = useGetProducts()
  const [productSearch, setProductSearch] = useState('')

  const productUuids = useWatch({ control, name: 'productUuids' }) || []

  const toggleProduct = (prodUuid: string) => {
    if (productUuids.includes(prodUuid)) {
      setValue(
        'productUuids',
        productUuids.filter((id) => id !== prodUuid),
      )
    } else {
      setValue('productUuids', [...productUuids, prodUuid])
    }
  }

  const removeProduct = (prodUuid: string) => {
    setValue(
      'productUuids',
      productUuids.filter((id) => id !== prodUuid),
    )
  }

  const filteredProducts = allProducts.filter((p) => {
    if (!productSearch) return true
    const q = productSearch.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  })

  const selectedProducts = allProducts.filter((p) =>
    productUuids.includes(p.uuid),
  )

  return (
    <SectionCard>
      <SectionHeader>
        <div>
          <Typography
            variant="title"
            style={{ fontSize: '1.1rem', fontWeight: 700 }}
          >
            Produk dalam Koleksi ({productUuids.length})
          </Typography>
          <Typography variant="caption" color="secondary">
            Pilih produk untuk ditampilkan dalam koleksi ini.
          </Typography>
        </div>

        {productUuids.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValue('productUuids', [])}
          >
            Hapus Semua
          </Button>
        )}
      </SectionHeader>

      {/* {selectedProducts.length > 0 && (
        <SelectedPills>
          {selectedProducts.map((p) => (
            <SelectedPill key={p.uuid}>
              <span>{p.name}</span>
              <button
                type="button"
                onClick={() => removeProduct(p.uuid)}
                aria-label={`Remove ${p.name}`}
              >
                <Delete02Icon size={14} />
              </button>
            </SelectedPill>
          ))}
        </SelectedPills>
      )} */}

      <SearchInputWrapper>
        <Search01Icon size={16} />
        <input
          type="text"
          placeholder="Cari katalog untuk menambahkan produk..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />
      </SearchInputWrapper>

      <ProductPickerList>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              padding: 28,
              textAlign: 'center',
              color: theme.colors.muted,
            }}
          >
            <Typography variant="caption">
              Tidak ada produk yang cocok dengan pencarian Anda.
            </Typography>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isSelected = productUuids.includes(p.uuid)
            const img = p.images?.[0] || DEFAULT_IMAGE

            return (
              <ProductPickerItem
                key={p.uuid}
                $selected={isSelected}
                onClick={() => toggleProduct(p.uuid)}
              >
                <ProductItemInfo>
                  <img src={img} alt={p.name} />
                  <div>
                    <Typography variant="body" style={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      ${p.basePrice.toFixed(2)} • {p.category || 'Umum'}
                    </Typography>
                  </div>
                </ProductItemInfo>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Badge
                    size="sm"
                    variant={p.status === 'active' ? 'success' : 'neutral'}
                  >
                    {p.status === 'active'
                      ? 'Aktif'
                      : p.status === 'draft'
                        ? 'Draf'
                        : p.status === 'archived'
                          ? 'Diarsipkan'
                          : p.status}
                  </Badge>
                  <CheckboxIcon $checked={isSelected}>
                    {isSelected ? (
                      <CheckmarkSquare02Icon size={20} />
                    ) : (
                      <SquareIcon size={20} />
                    )}
                  </CheckboxIcon>
                </div>
              </ProductPickerItem>
            )
          })
        )}
      </ProductPickerList>
    </SectionCard>
  )
}
