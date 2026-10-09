import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { useArticleScope, useGetArticle } from '#/services/article/useArticles'

import {
  ArticleContainer,
  ArticleError,
  ArticleLoading,
} from './-components/article-styles'
import { ArticlePreview } from './-components/ArticlePreview'

export const ArticleDetailPage = () => {
  const { articleId } = Route.useParams()
  const scope = useArticleScope()
  const query = useGetArticle(scope, articleId)
  return (
    <ArticleContainer $narrow>
      <PageHeader
        title="Pratinjau artikel"
        backTo="/admin/articles"
        actions={
          query.data && (
            <Button
              nativeButton={false}
              render={
                <Link
                  to="/admin/articles/$articleId/edit"
                  params={{ articleId }}
                />
              }
            >
              Edit artikel
            </Button>
          )
        }
      />
      {!scope ? (
        <p>Buat toko terlebih dahulu untuk mulai mengelola artikel.</p>
      ) : query.isPending ? (
        <ArticleLoading />
      ) : query.isError ? (
        <ArticleError role="alert">
          {query.error.message}{' '}
          <Button
            variant="outline"
            color="neutral"
            onClick={() => void query.refetch()}
          >
            Coba lagi
          </Button>
        </ArticleError>
      ) : !query.data ? (
        <EmptyState
          title="Artikel tidak ditemukan"
          description="Artikel ini mungkin telah dihapus. Kembali ke daftar artikel untuk melanjutkan."
        />
      ) : (
        <ArticlePreview article={query.data} />
      )}
    </ArticleContainer>
  )
}

export const Route = createFileRoute(
  '/_authenticated/admin/articles/$articleId/',
)({ component: ArticleDetailPage })
