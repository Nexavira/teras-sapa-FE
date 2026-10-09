import { createFileRoute, useNavigate } from '@tanstack/react-router'

import styled from '@emotion/styled'

import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { useCreateProduct } from '#/services/product/useCreateProduct'

import { ProductForm } from './-schema/ProductForm'
import type { ProductFormValues } from './-utils/-product-schema'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(900px, 100%);
  margin: 0 auto;
`

export const ProductCreatePage = () => {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: ProductFormValues) => {
    await createProduct.mutateAsync(data)
    navigate({ to: '/admin/products' })
  }

  const handleCancel = () => {
    navigate({ to: '/admin/products' })
  }

  return (
    <Container>
      <PageHeader
        title="Tambah Produk Baru"
        description="Konfigurasikan detail katalog, harga, inventaris, dan varian."
        backTo="/admin/products"
      />

      <ProductForm
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
        onCancel={handleCancel}
      />
    </Container>
  )
}

export const Route = createFileRoute('/_authenticated/admin/products/create')({
  component: ProductCreatePage,
})
