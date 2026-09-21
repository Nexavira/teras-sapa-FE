import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CollectionFormValues } from '#/routes/_authenticated/admin/collections/-utils/-collection-schema'
import type { Collection } from '#/types/collection.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { collectionStorage } from './collectionStorage'

export const useCreateCollection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CollectionFormValues): Promise<Collection> => {
      try {
        const response = await fetchHelper<
          ApiResponse<Collection>,
          CollectionFormValues
        >('/api/v1/portal/collections', {
          method: 'POST',
          body,
        })
        if (response.data) {
          collectionStorage.saveCollection(response.data)
          return response.data
        }
      } catch {
        // Fallback to client-persistent storage
      }

      return collectionStorage.saveCollection({
        title: body.title,
        slug: body.slug,
        description: body.description,
        image: body.image,
        productUuids: body.productUuids || [],
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
