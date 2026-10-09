import { useState } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { PlusSignIcon } from 'hugeicons-react'

import { Button } from '#/-components/ui/primitives/Button'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { useDeleteProduct } from '#/services/product/useDeleteProduct'
import { useGetProducts } from '#/services/product/useGetProducts'
import type { Product } from '#/types/product.type'

import type { ProductStatusFilter } from './-components/ProductFilters'
import { ProductFilters } from './-components/ProductFilters'
import { ProductStats } from './-components/ProductStats'
import { ProductTable } from './-components/ProductTable'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(1200px, 100%);
  margin: 0 auto;
`

export const ProductsPage = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>('all')

  const { data: products = [], isLoading } = useGetProducts({
    search: search || undefined,
    status: statusFilter,
  })

  const { data: allProducts = [] } = useGetProducts()
  const deleteProduct = useDeleteProduct()

  const handleDelete = (product: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus "${product.name}"?`)) {
      deleteProduct.mutate(product.uuid)
    }
  }

  return (
    <Container>
      <PageHeader
        title="Produk"
        description="Kelola inventaris, varian, kategori, dan harga di seluruh katalog Anda."
        actions={
          <Link to="/admin/products/create">
            <Button variant="solid" color="primary">
              <PlusSignIcon size={16} /> Tambah produk
            </Button>
          </Link>
        }
      />

      <ProductStats products={allProducts} />

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </Container>
  )
}

export const Route = createFileRoute('/_authenticated/admin/products/')({
  component: ProductsPage,
})
