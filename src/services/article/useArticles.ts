import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { ArticleFormValues } from '#/routes/_authenticated/admin/articles/-utils/-article-schema'
import { useGetUserSession } from '#/services/auth/useGetUserSession'
import type { GetArticlesParams } from '#/types/article.type'

import { articleStorage } from './articleStorage'

export const useArticleScope = () => {
  const { data } = useGetUserSession()
  const user = data?.user
  const tenant = user?.tenants.at(0)
  return user && tenant ? `${user.uuid}:${tenant.uuid}` : ''
}

export const useGetArticles = (scope: string, params: GetArticlesParams = {}) =>
  useQuery({
    queryKey: ['articles', scope, 'list', params],
    queryFn: () => articleStorage.getArticles(scope, params),
    enabled: Boolean(scope),
    retry: false,
  })

export const useGetArticle = (scope: string, uuid: string) =>
  useQuery({
    queryKey: ['articles', scope, 'detail', uuid],
    queryFn: () => articleStorage.getArticle(scope, uuid),
    enabled: Boolean(scope && uuid),
    retry: false,
  })

export const useCreateArticle = (scope: string) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: ArticleFormValues) =>
      Promise.resolve().then(() => articleStorage.saveArticle(scope, body)),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ['articles', scope] }),
  })
}

export const useUpdateArticle = (scope: string, uuid: string) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (body: ArticleFormValues) =>
      Promise.resolve().then(() =>
        articleStorage.saveArticle(scope, body, uuid),
      ),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ['articles', scope] }),
  })
}

export const useDeleteArticle = (scope: string) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) =>
      Promise.resolve().then(() => articleStorage.deleteArticle(scope, uuid)),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ['articles', scope] }),
  })
}
