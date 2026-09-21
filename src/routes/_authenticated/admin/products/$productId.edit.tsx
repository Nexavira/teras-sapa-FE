import { createFileRoute, useNavigate } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { AlertCircleIcon } from 'hugeicons-react'

import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { Typography } from '#/-components/ui/primitives/Typography'
import { useGetProduct } from '#/services/product/useGetProduct'
import { useUpdateProduct } from '#/services/product/useUpdateProduct'

import { ProductForm } from './-schema/ProductForm'
import type { ProductFormValues } from './-utils/-product-schema'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(900px, 100%);
  margin: 0 auto;
`

export const ProductEditPage = () => {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const { data: product, isLoading } = useGetProduct(productId)
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (data: ProductFormValues) => {
    if (!product?.uuid) return
    await updateProduct.mutateAsync({
      uuid: product.uuid,
      body: data,
    })
    navigate({ to: '/admin/products' })
  }

  const handleCancel = () => {
    navigate({ to: '/admin/products' })
  }

  if (isLoading) {
    return (
      <Container>
        <PageHeader title="Edit Product" backTo="/admin/products" />
        <Typography variant="body" color="muted">
          Loading product details...
        </Typography>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container>
        <PageHeader title="Edit Product" backTo="/admin/products" />
        <EmptyState
          icon={<AlertCircleIcon size={44} />}
          title="Product Not Found"
          description="The product you are trying to edit does not exist or has been removed."
          action={
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/admin/products' })}
            >
              Return to Catalog
            </Button>
          }
        />
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader
        title={`Edit ${product.name}`}
        description="Update pricing, variants, tags, and catalog settings."
        backTo="/admin/products"
      />

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
        onCancel={handleCancel}
      />
    </Container>
  )
}

export const Route = createFileRoute(
  '/_authenticated/admin/products/$productId/edit',
)({
  component: ProductEditPage,
})
