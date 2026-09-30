import { beforeEach, describe, expect, it, vi } from 'vitest'

import { initialArticleFormValues } from '#/routes/_authenticated/admin/articles/-utils/-article-schema'

import { articleStorage } from './articleStorage'

const scope = 'user:store'
const body = {
  ...initialArticleFormValues,
  title: 'A store update',
  slug: 'a-store-update',
  author: 'Store team',
  content: 'Our latest news.',
  tags: ['News'],
}

describe('article storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('persists create, publish, update, and delete across reads', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-24T08:00:00Z'))
    const created = articleStorage.saveArticle(scope, body)
    expect(articleStorage.getArticle(scope, created.uuid)).toEqual(created)
    expect(created.publishedAt).toBeNull()
    vi.setSystemTime(new Date('2026-09-25T08:00:00Z'))
    const published = articleStorage.saveArticle(
      scope,
      { ...body, status: 'published' },
      created.uuid,
    )
    expect(published.createdAt).toBe(created.createdAt)
    expect(published.publishedAt).toBe('2026-09-25T08:00:00.000Z')
    vi.setSystemTime(new Date('2026-09-26T08:00:00Z'))
    const edited = articleStorage.saveArticle(
      scope,
      { ...body, title: 'Updated news', status: 'published' },
      created.uuid,
    )
    expect(edited.publishedAt).toBe(published.publishedAt)
    expect(articleStorage.getArticles(scope)).toHaveLength(1)
    articleStorage.deleteArticle(scope, created.uuid)
    expect(articleStorage.getArticle(scope, created.uuid)).toBeNull()
    expect(articleStorage.getArticles(scope)).toEqual([])
    expect(() => articleStorage.saveArticle(scope, body, created.uuid)).toThrow(
      'no longer exists',
    )
  })

  it('isolates stores and accounts and rejects duplicate slugs in one scope', () => {
    articleStorage.saveArticle(scope, body)
    expect(articleStorage.getArticles('user:other-store')).toEqual([])
    expect(articleStorage.getArticles('other-user:store')).toEqual([])
    expect(() => articleStorage.saveArticle(scope, body)).toThrow(
      'already uses this slug',
    )
    expect(() =>
      articleStorage.saveArticle('user:other-store', body),
    ).not.toThrow()
    expect(() => articleStorage.saveArticle('', body)).toThrow('Select a store')
  })

  it('combines case-insensitive search and publication filters', () => {
    articleStorage.saveArticle(scope, body)
    articleStorage.saveArticle(scope, {
      ...body,
      slug: 'second',
      status: 'published',
    })
    expect(
      articleStorage.getArticles(scope, {
        search: ' NEWS ',
        status: 'published',
      }),
    ).toHaveLength(1)
    expect(articleStorage.getArticles(scope, { search: 'missing' })).toEqual([])
  })

  it('preserves unreadable storage instead of replacing it', () => {
    localStorage.setItem(`shopiti_articles_v1:${scope}`, 'broken data')
    expect(() => articleStorage.saveArticle(scope, body)).toThrow(
      'Could not read',
    )
    expect(localStorage.getItem(`shopiti_articles_v1:${scope}`)).toBe(
      'broken data',
    )
  })

  it('reports failed writes without claiming the article was saved', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    expect(() => articleStorage.saveArticle(scope, body)).toThrow(
      'Could not save',
    )
    expect(articleStorage.getArticles(scope)).toEqual([])
  })
})
