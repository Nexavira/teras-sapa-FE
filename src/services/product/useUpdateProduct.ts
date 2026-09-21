import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ProductFormValues } from '#/routes/_authenticated/admin/products/-utils/-product-schema'
import type { ApiResponse } from '#/types/global.type'
import type { Product } from '#/types/product.type'
import { fetchHelper } from '#/utils/fetchHelper'

import { productStorage } from './productStorage'

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      uuid,
      body,
    }: {
      uuid: string
      body: ProductFormValues
    }): Promise<Product> => {
      try {
        const response = await fetchHelper<
          ApiResponse<Product>,
          ProductFormValues
        >(`/api/v1/portal/products/${uuid}`, {
          method: 'PUT',
          body,
        })
        if (response.data) {
          productStorage.saveProduct(response.data)
          return response.data
        }
      } catch {
        // Fallback to client-persistent storage
      }

      const totalInventory = (body.variants || []).reduce(
        (sum, v) => sum + (v.stockQuantity || 0),
        0,
      )

      return productStorage.saveProduct({
        uuid,
        name: body.name,
        slug: body.slug,
        description: body.description,
        status: body.status,
        type: body.type,
        basePrice: body.basePrice,
        compareAtPrice: body.compareAtPrice,
        images: body.images,
        category: body.category,
        vendor: body.vendor,
        tags: body.tags,
        variants: (body.variants || []).map((v, i) => ({
          id: v.id || `var-${Date.now()}-${i}`,
          sku: v.sku,
          name: v.name,
          priceOverride: v.priceOverride,
          stockQuantity: v.stockQuantity,
        })),
        totalInventory,
      })
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      void queryClient.invalidateQueries({
        queryKey: ['products', variables.uuid],
      })
      void queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
