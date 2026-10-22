import type { Product } from './product.type'

export interface Collection {
  uuid: string
  title: string
  slug: string
  description?: string
  image?: string
  productUuids: Array<string>
  createdAt: string
  updatedAt: string
}

export interface CollectionWithProducts extends Collection {
  products: Array<Product>
}

export interface GetCollectionsParams {
  search?: string
  limit?: number
  page?: number
}
