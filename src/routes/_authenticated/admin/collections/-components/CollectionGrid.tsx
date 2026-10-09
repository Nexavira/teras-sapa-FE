import styled from '@emotion/styled'
import { GridTableIcon } from 'hugeicons-react'

import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { Typography } from '#/-components/ui/primitives/Typography'
import type { Collection } from '#/types/collection.type'
import type { Product } from '#/types/product.type'

import { CollectionCardItem } from './CollectionCardItem'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const FullWidthBox = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
`

interface CollectionGridProps {
  collections: Collection[]
  allProducts: Product[]
  isLoading: boolean
  onDelete: (collection: Collection) => void
}

export const CollectionGrid = ({
  collections,
  allProducts,
  isLoading,
  onDelete,
}: CollectionGridProps) => {
  if (isLoading) {
    return (
      <GridContainer>
        <FullWidthBox>
          <Typography variant="body" color="muted">
            Memuat koleksi...
          </Typography>
        </FullWidthBox>
      </GridContainer>
    )
  }

  if (collections.length === 0) {
    return (
      <GridContainer>
        <FullWidthBox style={{ padding: 0 }}>
          <EmptyState
            icon={<GridTableIcon size={48} />}
            title="Tidak ada koleksi ditemukan"
            description="Buat koleksi pertama Anda untuk menampilkan grup produk di toko online."
          />
        </FullWidthBox>
      </GridContainer>
    )
  }

  return (
    <GridContainer>
      {collections.map((col) => (
        <CollectionCardItem
          key={col.uuid}
          collection={col}
          allProducts={allProducts}
          onDelete={onDelete}
        />
      ))}
    </GridContainer>
  )
}
