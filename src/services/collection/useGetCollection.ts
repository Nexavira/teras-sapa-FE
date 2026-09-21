import { useQuery } from '@tanstack/react-query'

import type { CollectionWithProducts } from '#/types/collection.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { collectionStorage } from './collectionStorage'

export const useGetCollection = (uuid?: string) => {
  return useQuery({
    queryKey: ['collections', uuid],
    queryFn: async (): Promise<CollectionWithProducts | null> => {
      if (!uuid) return null
      try {
        const response = await fetchHelper<ApiResponse<CollectionWithProducts>>(
          `/api/v1/portal/collections/${uuid}`,
        )
        if (response.data) return response.data
      } catch {
        // Fallback to client-persistent storage
      }
      return collectionStorage.getCollectionByUuid(uuid)
    },
    enabled: Boolean(uuid),
  })
}
