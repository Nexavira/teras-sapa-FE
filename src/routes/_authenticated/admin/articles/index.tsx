import { useState } from 'react'

import { createFileRoute, Link } from '@tanstack/react-router'

import { PlusSignIcon } from 'hugeicons-react'

import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import { FilterBar } from '#/-components/ui/primitives/FilterBar'
import { PageHeader } from '#/-components/ui/primitives/PageHeader'
import { Typography } from '#/-components/ui/primitives/Typography'
import {
  useArticleScope,
  useDeleteArticle,
  useGetArticles,
} from '#/services/article/useArticles'
import type { Article, ArticleStatus } from '#/types/article.type'

import { ArticleContainer, ArticleError } from './-components/article-styles'
import { ArticleStats } from './-components/ArticleStats'
import { ArticleTable } from './-components/ArticleTable'

export const ArticlesPage = () => {
  const scope = useArticleScope()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ArticleStatus | 'all'>('all')
  const [feedback, setFeedback] = useState('')
  const query = useGetArticles(scope, { search, status })
  const allArticles = useGetArticles(scope)
  const mutation = useDeleteArticle(scope)
  const filtered = Boolean(search.trim()) || status !== 'all'
  const handleDelete = async (article: Article) => {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`))
      return
    setFeedback('')
    try {
      await mutation.mutateAsync(article.uuid)
      setFeedback(`Deleted "${article.title}".`)
    } catch {
      // The mutation error is displayed below the filters.
    }
  }

  return (
    <ArticleContainer>
      <PageHeader
        title="Blog articles"
        description="Manage article content, authors, tags, and publishing status."
        actions={
          <Button
            nativeButton={false}
            render={<Link to="/admin/articles/create" />}
            disabled={!scope}
          >
            <PlusSignIcon size={16} /> Create article
          </Button>
        }
      />

      {allArticles.data && <ArticleStats articles={allArticles.data} />}

      <FilterBar<ArticleStatus | 'all'>
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search articles by title, author, or tag..."
        tabs={[
          { key: 'all', label: 'All' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Draft' },
        ]}
        activeTab={status}
        onTabChange={setStatus}
      />

      {feedback && <div role="status">{feedback}</div>}
      {mutation.isError && (
        <ArticleError role="alert">{mutation.error.message}</ArticleError>
      )}

      {!scope ? (
        <EmptyState
          title="Create your store first"
          description="Complete store setup to start managing blog articles."
        />
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
      ) : (
        <ArticleTable
          articles={query.data ?? []}
          isLoading={query.isPending}
          isDeleting={mutation.isPending}
          filtered={filtered}
          onClearFilters={() => {
            setSearch('')
            setStatus('all')
          }}
          onDelete={(article) => void handleDelete(article)}
        />
      )}

      <Typography variant="caption" color="secondary">
        Articles are saved in this browser for this store. Published status does
        not yet publish to your live website.
      </Typography>
    </ArticleContainer>
  )
}

export const Route = createFileRoute('/_authenticated/admin/articles/')({
  component: ArticlesPage,
})
