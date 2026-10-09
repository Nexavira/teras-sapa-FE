import { createFileRoute, useNavigate } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { AlertCircleIcon } from 'hugeicons-react'

import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { Typography } from '#/-components/ui/primitives/Typography'
import { useGetCollection } from '#/services/collection/useGetCollection'
import { useUpdateCollection } from '#/services/collection/useUpdateCollection'

import { CollectionForm } from './-schema/CollectionForm'
import type { CollectionFormValues } from './-utils/-collection-schema'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(900px, 100%);
  margin: 0 auto;
`

export const CollectionEditPage = () => {
  const { collectionId } = Route.useParams()
  const navigate = useNavigate()
  const { data: collection, isLoading } = useGetCollection(collectionId)
  const updateCollection = useUpdateCollection()

  const handleSubmit = async (data: CollectionFormValues) => {
    if (!collection?.uuid) return
    await updateCollection.mutateAsync({
      uuid: collection.uuid,
      body: data,
    })
    navigate({ to: '/admin/collections' })
  }

  const handleCancel = () => {
    navigate({ to: '/admin/collections' })
  }

  if (isLoading) {
    return (
      <Container>
        <PageHeader title="Edit Koleksi" backTo="/admin/collections" />
        <Typography variant="body" color="muted">
          Memuat detail koleksi...
        </Typography>
      </Container>
    )
  }

  if (!collection) {
    return (
      <Container>
        <PageHeader title="Edit Koleksi" backTo="/admin/collections" />
        <EmptyState
          icon={<AlertCircleIcon size={44} />}
          title="Koleksi Tidak Ditemukan"
          description="Koleksi yang ingin Anda edit tidak ada atau telah dihapus."
          action={
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/admin/collections' })}
            >
              Kembali ke Koleksi
            </Button>
          }
        />
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader
        title={`Edit ${collection.title}`}
        description="Kelompokkan produk ke dalam koleksi untuk daftar tampilan toko dan seksi bertema."
        backTo="/admin/collections"
      />

      <CollectionForm
        initialData={collection}
        onSubmit={handleSubmit}
        isSubmitting={updateCollection.isPending}
        onCancel={handleCancel}
      />
    </Container>
  )
}

export const Route = createFileRoute(
  '/_authenticated/admin/collections/$collectionId/edit',
)({
  component: CollectionEditPage,
})
