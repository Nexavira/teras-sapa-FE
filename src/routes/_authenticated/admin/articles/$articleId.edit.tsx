import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import {
  useArticleScope,
  useGetArticle,
  useUpdateArticle,
} from '#/services/article/useArticles'

import {
  ArticleContainer,
  ArticleError,
  ArticleLoading,
} from './-components/article-styles'
import { ArticleForm } from './-schema/ArticleForm'

export const ArticleEditPage = () => {
  const { articleId } = Route.useParams()
  const scope = useArticleScope()
  const query = useGetArticle(scope, articleId)
  const mutation = useUpdateArticle(scope, articleId)
  const navigate = useNavigate()
  return (
    <ArticleContainer $narrow>
      <PageHeader
        title="Edit article"
        description="Update your article content and publication status."
        backTo="/admin/articles"
      />
      {!scope ? (
        <p>Create a store to start managing articles.</p>
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
            Retry
          </Button>
        </ArticleError>
      ) : !query.data ? (
        <EmptyState
          title="Article not found"
          description="This article may have been deleted. Return to the article list to continue."
        />
      ) : (
        <ArticleForm
          key={`${scope}:${articleId}`}
          initialData={query.data}
          isSubmitting={mutation.isPending}
          onCancel={() => void navigate({ to: '/admin/articles' })}
          onSubmit={async (values) => {
            await mutation.mutateAsync(values)
            await navigate({ to: '/admin/articles' })
          }}
        />
      )}
    </ArticleContainer>
  )
}

export const Route = createFileRoute(
  '/_authenticated/admin/articles/$articleId/edit',
)({ component: ArticleEditPage })
