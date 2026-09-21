import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import type { Product } from '#/types/product.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { productStorage } from './productStorage'

export const useGetProduct = (uuid?: string) => {
  return useQuery({
    queryKey: ['products', uuid],
    queryFn: async (): Promise<Product | null> => {
      if (!uuid) return null
      try {
        const response = await fetchHelper<ApiResponse<Product>>(
          `/api/v1/portal/products/${uuid}`,
        )
        if (response.data) return response.data
      } catch {
        // Fallback to client-persistent storage
      }
      return productStorage.getProductByUuid(uuid)
    },
    enabled: Boolean(uuid),
  })
}
