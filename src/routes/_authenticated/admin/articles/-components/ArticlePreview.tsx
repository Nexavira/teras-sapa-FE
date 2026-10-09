import styled from '@emotion/styled'

import { Badge } from '#/-components/ui/primitives/Badge'
import { Typography } from '#/-components/ui/primitives/Typography'

import type { ArticleFormValues } from '../-utils/-article-schema'
import { ArticleSection } from './article-styles'

const Content = styled.div`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.8;
`

const Cover = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
`

export const ArticlePreview = ({ article }: { article: ArticleFormValues }) => (
  <ArticleSection
    role="article"
    aria-label="Pratinjau artikel"
    style={{ overflowWrap: 'anywhere' }}
  >
    <div>
      <Badge variant={article.status === 'published' ? 'success' : 'neutral'}>
        {article.status === 'published' ? 'Diterbitkan' : 'Draf'}
      </Badge>
    </div>
    <Typography as="h1" variant="display">
      {article.title || 'Artikel tanpa judul'}
    </Typography>
    <Typography color="secondary">Oleh {article.author || 'Penulis'}</Typography>
    {/^https?:\/\//i.test(article.coverImage) && (
      <Cover
        src={article.coverImage}
        alt={`Sampul untuk ${article.title || 'artikel ini'}`}
      />
    )}
    {article.excerpt && (
      <Typography color="secondary">{article.excerpt}</Typography>
    )}
    <Content>
      {article.content || 'Konten artikel Anda akan muncul di sini.'}
    </Content>
    {article.tags.length > 0 && (
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {article.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    )}
  </ArticleSection>
)
