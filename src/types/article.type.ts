export type ArticleStatus = 'draft' | 'published'

export interface Article {
  uuid: string
  title: string
  slug: string
  author: string
  excerpt: string
  content: string
  coverImage: string
  tags: Array<string>
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface GetArticlesParams {
  search?: string
  status?: ArticleStatus | 'all'
}
