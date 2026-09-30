import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import {
  useArticleScope,
  useCreateArticle,
} from '#/services/article/useArticles'

import { ArticleContainer } from './-components/article-styles'
import { ArticleForm } from './-schema/ArticleForm'

export const ArticleCreatePage = () => {
  const scope = useArticleScope()
  const mutation = useCreateArticle(scope)
  const navigate = useNavigate()
  return (
    <ArticleContainer $narrow>
      <PageHeader
        title="Create article"
        description="Write a new blog article and choose its publication status."
        backTo="/admin/articles"
      />
      {scope ? (
        <ArticleForm
          key={scope}
          isSubmitting={mutation.isPending}
          onCancel={() => void navigate({ to: '/admin/articles' })}
          onSubmit={async (values) => {
            await mutation.mutateAsync(values)
            await navigate({ to: '/admin/articles' })
          }}
        />
      ) : (
        <p>Create a store to start managing articles.</p>
      )}
    </ArticleContainer>
  )
}

export const Route = createFileRoute('/_authenticated/admin/articles/create')({
  component: ArticleCreatePage,
})
