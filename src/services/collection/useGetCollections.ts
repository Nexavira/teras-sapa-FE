import { useQuery } from '@tanstack/react-query'

import type { Collection, GetCollectionsParams } from '#/types/collection.type'
import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { collectionStorage } from './collectionStorage'

export const useGetCollections = (params: GetCollectionsParams = {}) => {
  return useQuery({
    queryKey: ['collections', params],
    queryFn: async (): Promise<Array<Collection>> => {
      try {
        const response = await fetchHelper<ApiResponse<Array<Collection>>>(
          '/api/v1/portal/collections',
          { query: params as Record<string, string | number> },
        )
        if (response.data) return response.data
      } catch {
        // Fallback to client-persistent storage
      }
      return collectionStorage.getCollections(params)
    },
  })
}
