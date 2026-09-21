import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { productStorage } from './productStorage'

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (uuid: string): Promise<boolean> => {
      try {
        await fetchHelper<ApiResponse<{ success: boolean }>>(
          `/api/v1/portal/products/${uuid}`,
          { method: 'DELETE' },
        )
      } catch {
        // Fallback to client-persistent storage
      }
      return productStorage.deleteProduct(uuid)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
