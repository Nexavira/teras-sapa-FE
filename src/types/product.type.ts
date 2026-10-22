export type ProductStatus = 'active' | 'draft' | 'archived'
export type ProductType = 'physical' | 'digital'

export interface ProductVariant {
  id: string
  sku: string
  name: string
  priceOverride?: number | null
  stockQuantity: number
  attributes?: Record<string, string>
}

export interface Product {
  uuid: string
  name: string
  slug: string
  description?: string
  status: ProductStatus
  type: ProductType
  basePrice: number
  compareAtPrice?: number | null
  images: Array<string>
  category?: string
  vendor?: string
  tags?: Array<string>
  variants: Array<ProductVariant>
  totalInventory: number
  createdAt: string
  updatedAt: string
}

export interface GetProductsParams {
  search?: string
  status?: ProductStatus | 'all'
  category?: string
  limit?: number
  page?: number
}
