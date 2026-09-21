import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { collectionStorage } from './collectionStorage'

export const useDeleteCollection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (uuid: string): Promise<boolean> => {
      try {
        await fetchHelper<ApiResponse<{ success: boolean }>>(
          `/api/v1/portal/collections/${uuid}`,
          { method: 'DELETE' },
        )
      } catch {
        // Fallback to client-persistent storage
      }
      return collectionStorage.deleteCollection(uuid)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
