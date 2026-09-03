export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}
