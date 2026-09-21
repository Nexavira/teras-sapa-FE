import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { Delete02Icon, Edit02Icon, GridTableIcon } from 'hugeicons-react'

import { ActionIconButton } from '#/-components/ui/primitives/ActionIconButton'
import { Badge } from '#/-components/ui/primitives/Badge'
import { Card } from '#/-components/ui/primitives/Card'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'
import type { Collection } from '#/types/collection.type'
import type { Product } from '#/types/product.type'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  border-radius: 16px;
  background: ${theme.colors.white};
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  }
`

const CoverImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  background: ${theme.colors.paper};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const CoverPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${theme.colors.muted};
  background: linear-gradient(
    135deg,
    ${theme.colors.paper} 0%,
    rgba(0, 168, 107, 0.05) 100%
  );
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  gap: 12px;
`

const CardTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`

const ProductStack = styled.div`
  display: flex;
  align-items: center;
  gap: -6px;
  margin-top: 4px;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid ${theme.colors.white};
    object-fit: cover;
    margin-left: -6px;

    &:first-of-type {
      margin-left: 0;
    }
  }
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.paper};
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

interface CollectionCardItemProps {
  collection: Collection
  allProducts: Product[]
  onDelete: (collection: Collection) => void
}

const DEFAULT_PRODUCT_IMG =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&auto=format&fit=crop&q=80'

export const CollectionCardItem = ({
  collection,
  allProducts,
  onDelete,
}: CollectionCardItemProps) => {
  const assigned = collection.productUuids
    .map((id) => allProducts.find((p) => p.uuid === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const count = collection.productUuids.length

  return (
    <StyledCard>
      <CoverImageWrapper>
        {collection.image ? (
          <img src={collection.image} alt={collection.title} />
        ) : (
          <CoverPlaceholder>
            <GridTableIcon size={36} />
          </CoverPlaceholder>
        )}
      </CoverImageWrapper>

      <CardContent>
        <CardTitleRow>
          <div>
            <Typography
              variant="body"
              style={{ fontWeight: 800, fontSize: '1.05rem' }}
            >
              {collection.title}
            </Typography>
            <Typography variant="caption" color="secondary">
              /{collection.slug}
            </Typography>
          </div>
          <Badge size="sm" variant="neutral">
            {count} product{count === 1 ? '' : 's'}
          </Badge>
        </CardTitleRow>

        {collection.description && (
          <Typography
            variant="caption"
            color="secondary"
            style={{
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {collection.description}
          </Typography>
        )}

        {assigned.length > 0 && (
          <ProductStack>
            {assigned.slice(0, 5).map((p) => {
              const img = p.images[0] || DEFAULT_PRODUCT_IMG
              return <img key={p.uuid} src={img} alt={p.name} title={p.name} />
            })}

            {assigned.length > 5 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: theme.colors.text.secondary,
                  marginLeft: 8,
                  fontWeight: 600,
                }}
              >
                +{assigned.length - 5} more
              </span>
            )}
          </ProductStack>
        )}
      </CardContent>

      <CardFooter>
        <Typography variant="caption" color="secondary">
          Ready for editor
        </Typography>

        <ActionButtons>
          <Link
            to="/admin/collections/$collectionId/edit"
            params={{ collectionId: collection.uuid }}
          >
            <ActionIconButton
              title="Edit Collection"
              aria-label="Edit Collection"
            >
              <Edit02Icon size={16} />
            </ActionIconButton>
          </Link>

          <ActionIconButton
            danger
            onClick={() => onDelete(collection)}
            title="Delete Collection"
            aria-label="Delete Collection"
          >
            <Delete02Icon size={16} />
          </ActionIconButton>
        </ActionButtons>
      </CardFooter>
    </StyledCard>
  )
}
