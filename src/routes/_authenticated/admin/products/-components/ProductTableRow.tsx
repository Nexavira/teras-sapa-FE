import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { Delete02Icon, Edit02Icon } from 'hugeicons-react'

import { ActionIconButton } from '#/-components/ui/primitives/ActionIconButton'
import { Badge } from '#/-components/ui/primitives/Badge'
import { Td, Tr } from '#/-components/ui/primitives/Table'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'
import type { Product } from '#/types/product.type'

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid ${theme.colors.border};
    flex-shrink: 0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

interface ProductTableRowProps {
  product: Product
  onDelete: (product: Product) => void
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80'

export const ProductTableRow = ({
  product,
  onDelete,
}: ProductTableRowProps) => {
  const img = product.images?.[0] || DEFAULT_IMAGE
  const variantCount = product.variants?.length || 0

  return (
    <Tr>
      <Td>
        <ProductCell>
          <img src={img} alt={product.name} />
          <div>
            <Typography
              variant="body"
              style={{
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {product.name}
            </Typography>
            <Typography variant="caption" color="secondary">
              {variantCount} variant{variantCount === 1 ? '' : 's'} •{' '}
              {product.slug}
            </Typography>
          </div>
        </ProductCell>
      </Td>

      <Td>
        <Badge size="sm" variant="neutral">
          {product.category || 'General'}
        </Badge>
      </Td>

      <Td>
        <Badge
          size="sm"
          variant={
            product.status === 'active'
              ? 'success'
              : product.status === 'draft'
                ? 'warning'
                : 'neutral'
          }
          dot
        >
          {product.status}
        </Badge>
      </Td>

      <Td>
        <Typography
          variant="body"
          style={{
            fontWeight: 600,
            color:
              product.totalInventory <= 10
                ? '#d97706'
                : theme.colors.text.primary,
          }}
        >
          {product.totalInventory} in stock
        </Typography>
      </Td>

      <Td>
        <PriceContainer>
          <Typography variant="body" style={{ fontWeight: 700 }}>
            ${product.basePrice.toFixed(2)}
          </Typography>
          {product.compareAtPrice && (
            <Typography
              variant="caption"
              color="muted"
              style={{ textDecoration: 'line-through' }}
            >
              ${product.compareAtPrice.toFixed(2)}
            </Typography>
          )}
        </PriceContainer>
      </Td>

      <Td style={{ textAlign: 'right' }}>
        <ActionButtons>
          <Link
            to="/admin/products/$productId/edit"
            params={{ productId: product.uuid }}
          >
            <ActionIconButton title="Edit Product" aria-label="Edit Product">
              <Edit02Icon size={16} />
            </ActionIconButton>
          </Link>

          <ActionIconButton
            danger
            onClick={() => onDelete(product)}
            title="Delete Product"
            aria-label="Delete Product"
          >
            <Delete02Icon size={16} />
          </ActionIconButton>
        </ActionButtons>
      </Td>
    </Tr>
  )
}
