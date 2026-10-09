import { createFileRoute, useNavigate } from '@tanstack/react-router'

import styled from '@emotion/styled'

import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { useCreateCollection } from '#/services/collection/useCreateCollection'

import { CollectionForm } from './-schema/CollectionForm'
import type { CollectionFormValues } from './-utils/-collection-schema'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(900px, 100%);
  margin: 0 auto;
`

export const CollectionCreatePage = () => {
  const navigate = useNavigate()
  const createCollection = useCreateCollection()

  const handleSubmit = async (data: CollectionFormValues) => {
    await createCollection.mutateAsync(data)
    navigate({ to: '/admin/collections' })
  }

  const handleCancel = () => {
    navigate({ to: '/admin/collections' })
  }

  return (
    <Container>
      <PageHeader
        title="Buat Koleksi"
        description="Kelompokkan produk ke dalam koleksi untuk daftar tampilan toko dan seksi bertema."
        backTo="/admin/collections"
      />

      <CollectionForm
        onSubmit={handleSubmit}
        isSubmitting={createCollection.isPending}
        onCancel={handleCancel}
      />
    </Container>
  )
}

export const Route = createFileRoute(
  '/_authenticated/admin/collections/create',
)({
  component: CollectionCreatePage,
})
