import { useState } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { PlusSignIcon } from 'hugeicons-react'

import { Button } from '#/-components/ui/primitives/Button'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { useDeleteCollection } from '#/services/collection/useDeleteCollection'
import { useGetCollections } from '#/services/collection/useGetCollections'
import { useGetProducts } from '#/services/product/useGetProducts'
import type { Collection } from '#/types/collection.type'

import { CollectionFilters } from './-components/CollectionFilters'
import { CollectionGrid } from './-components/CollectionGrid'
import { CollectionStats } from './-components/CollectionStats'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(1200px, 100%);
  margin: 0 auto;
`

export const CollectionsPage = () => {
  const [search, setSearch] = useState('')

  const { data: collections = [], isLoading } = useGetCollections({
    search: search || undefined,
  })
  const { data: allProducts = [] } = useGetProducts()
  const deleteCollection = useDeleteCollection()

  const allCollections = useGetCollections().data || []

  const handleDelete = (collection: Collection) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${collection.title}"?`)) {
      deleteCollection.mutate(collection.uuid)
    }
  }

  return (
    <Container>
      <PageHeader
        title="Koleksi"
        description="Kelompokkan produk ke dalam koleksi untuk promo dan daftar tampilan toko."
        actions={
          <Link to="/admin/collections/create">
            <Button variant="solid" color="primary">
              <PlusSignIcon size={16} /> Buat koleksi
            </Button>
          </Link>
        }
      />

      <CollectionStats collections={allCollections} />

      <CollectionFilters search={search} onSearchChange={setSearch} />

      <CollectionGrid
        collections={collections}
        allProducts={allProducts}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </Container>
  )
}

export const Route = createFileRoute('/_authenticated/admin/collections/')({
  component: CollectionsPage,
})
