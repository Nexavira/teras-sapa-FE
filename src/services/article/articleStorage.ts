import { z } from 'zod'

import type { ArticleFormValues } from '#/routes/_authenticated/admin/articles/-utils/-article-schema'
import { articleSchema } from '#/routes/_authenticated/admin/articles/-utils/-article-schema'
import type { Article, GetArticlesParams } from '#/types/article.type'

const storedArticleSchema = articleSchema.extend({
  uuid: z.string(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// Local adapter until a server article contract is available. Never silently
// replace unreadable data: storage errors must reach the UI before any write.
const storageKey = (scope: string) => {
  if (!scope) throw new Error('Select a store before managing articles.')
  return `shopiti_articles_v1:${scope}`
}

const read = (scope: string): Array<Article> => {
  const key = storageKey(scope)
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? z.array(storedArticleSchema).parse(JSON.parse(stored)) : []
  } catch {
    throw new Error(
      'Could not read saved articles. Check browser storage and try again.',
    )
  }
}

const write = (scope: string, articles: Array<Article>) => {
  try {
    window.localStorage.setItem(storageKey(scope), JSON.stringify(articles))
  } catch {
    throw new Error(
      'Could not save articles. Browser storage may be full or unavailable.',
    )
  }
}

export const articleStorage = {
  getArticles: (
    scope: string,
    params: GetArticlesParams = {},
  ): Array<Article> => {
    const search = params.search?.trim().toLowerCase() ?? ''
    return read(scope)
      .filter(
        (article) =>
          (!params.status ||
            params.status === 'all' ||
            article.status === params.status) &&
          (!search ||
            [
              article.title,
              article.slug,
              article.author,
              article.excerpt,
              ...article.tags,
            ].some((value) => value.toLowerCase().includes(search))),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  getArticle: (scope: string, uuid: string): Article | null =>
    read(scope).find((article) => article.uuid === uuid) ?? null,
  saveArticle: (
    scope: string,
    body: ArticleFormValues,
    uuid?: string,
  ): Article => {
    const values = articleSchema.parse(body)
    const articles = read(scope)
    const existing = uuid
      ? articles.find((article) => article.uuid === uuid)
      : undefined
    if (uuid && !existing) throw new Error('This article no longer exists.')
    if (
      articles.some(
        (article) => article.slug === values.slug && article.uuid !== uuid,
      )
    ) {
      throw new Error(
        'An article already uses this slug. Choose a different slug.',
      )
    }
    const now = new Date().toISOString()
    const article: Article = {
      ...values,
      uuid: existing?.uuid ?? crypto.randomUUID(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt:
        values.status === 'published' ? (existing?.publishedAt ?? now) : null,
    }
    write(
      scope,
      existing
        ? articles.map((item) => (item.uuid === uuid ? article : item))
        : [article, ...articles],
    )
    return article
  },
  deleteArticle: (scope: string, uuid: string): void => {
    const articles = read(scope)
    if (!articles.some((article) => article.uuid === uuid))
      throw new Error('This article no longer exists.')
    write(
      scope,
      articles.filter((article) => article.uuid !== uuid),
    )
  },
}
