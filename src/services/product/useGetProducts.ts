import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '#/types/global.type'
import type { GetProductsParams, Product } from '#/types/product.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { productStorage } from './productStorage'

export const useGetProducts = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<Array<Product>> => {
      try {
        const response = await fetchHelper<ApiResponse<Array<Product>>>(
          '/api/v1/portal/products',
          { query: params as Record<string, string | number> },
        )
        if (response.data) return response.data
      } catch {
        // Fallback to client-persistent storage
      }
      return productStorage.getProducts(params)
    },
  })
}
