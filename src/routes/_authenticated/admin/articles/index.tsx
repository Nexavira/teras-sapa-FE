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
    if (!window.confirm(`Hapus "${article.title}"? Tindakan ini tidak dapat dibatalkan.`))
      return
    setFeedback('')
    try {
      await mutation.mutateAsync(article.uuid)
      setFeedback(`"${article.title}" berhasil dihapus.`)
    } catch {
      // The mutation error is displayed below the filters.
    }
  }

  return (
    <ArticleContainer>
      <PageHeader
        title="Artikel Blog"
        description="Kelola konten artikel, penulis, tag, dan status penerbitan."
        actions={
          <Button
            nativeButton={false}
            render={<Link to="/admin/articles/create" />}
            disabled={!scope}
          >
            <PlusSignIcon size={16} /> Buat artikel
          </Button>
        }
      />

      {allArticles.data && <ArticleStats articles={allArticles.data} />}

      <FilterBar<ArticleStatus | 'all'>
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari artikel berdasarkan judul, penulis, atau tag..."
        tabs={[
          { key: 'all', label: 'Semua' },
          { key: 'published', label: 'Diterbitkan' },
          { key: 'draft', label: 'Draf' },
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
          title="Buat toko Anda terlebih dahulu"
          description="Selesaikan penyiapan toko untuk mulai mengelola artikel blog."
        />
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
        Artikel disimpan di browser untuk toko ini. Status diterbitkan belum
        mempublikasikan ke situs web aktif Anda.
      </Typography>
    </ArticleContainer>
  )
}

export const Route = createFileRoute('/_authenticated/admin/articles/')({
  component: ArticlesPage,
})
