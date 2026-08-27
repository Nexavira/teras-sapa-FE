import { fetchHelper } from '#/utils/fetchHelper'

import type { CreateProductInput } from './productSchemas'

export interface Product extends CreateProductInput {
  id: number
  uuid: string
  createdAt: string
  updatedAt: string
}

export type GetProductsParams = {
  page?: number
  limit?: number
  categoryId?: number
  search?: string
}

export interface GetProductsResponse {
  items: Array<Product>
  totalCount: number
  totalPages: number
}

export const getProducts = (params: GetProductsParams = {}) =>
  fetchHelper<GetProductsResponse>('/api/products', { query: params })

export const createProduct = (input: CreateProductInput) =>
  fetchHelper<Product, CreateProductInput>('/api/products', {
    method: 'POST',
    body: input,
  })
