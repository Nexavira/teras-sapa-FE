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
        title="Buat artikel"
        description="Tulis artikel blog baru dan tentukan status publikasinya."
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
        <p>Buat toko terlebih dahulu untuk mulai mengelola artikel.</p>
      )}
    </ArticleContainer>
  )
}

export const Route = createFileRoute('/_authenticated/admin/articles/create')({
  component: ArticleCreatePage,
})
