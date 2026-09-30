import { Link, useNavigate } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { Delete02Icon, Edit02Icon, Note01Icon } from 'hugeicons-react'

import { ActionIconButton } from '#/-components/ui/primitives/ActionIconButton'
import { Badge } from '#/-components/ui/primitives/Badge'
import { Button } from '#/-components/ui/primitives/Button'
import { EmptyState } from '#/-components/ui/primitives/EmptyState'
import {
  Table,
  TableCard,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '#/-components/ui/primitives/Table'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'
import type { Article } from '#/types/article.type'

const ArticleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid ${theme.colors.border};
    flex-shrink: 0;
  }
`
const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
`

export const ArticleTable = ({
  articles,
  isLoading,
  isDeleting,
  filtered,
  onClearFilters,
  onDelete,
}: {
  articles: Array<Article>
  isLoading: boolean
  isDeleting: boolean
  filtered: boolean
  onClearFilters: () => void
  onDelete: (article: Article) => void
}) => {
  const navigate = useNavigate()
  return (
    <TableCard>
      <div style={{ overflowX: 'auto' }}>
        <Table aria-label="Blog articles">
          <Thead>
            <Tr>
              <Th scope="col">Article</Th>
              <Th scope="col">Author</Th>
              <Th scope="col">Status</Th>
              <Th scope="col">Updated</Th>
              <Th scope="col" style={{ textAlign: 'right' }}>
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5} style={{ textAlign: 'center', padding: 36 }}>
                  <span role="status">Loading articles...</span>
                </Td>
              </Tr>
            ) : articles.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <EmptyState
                    icon={<Note01Icon size={44} />}
                    title={
                      filtered ? 'No matching articles' : 'No articles yet'
                    }
                    description={
                      filtered
                        ? 'Try a different search or clear your filters.'
                        : 'Create your first article to start your blog.'
                    }
                    action={
                      filtered && (
                        <Button
                          variant="outline"
                          color="neutral"
                          onClick={onClearFilters}
                        >
                          Clear filters
                        </Button>
                      )
                    }
                  />
                </Td>
              </Tr>
            ) : (
              articles.map((article) => (
                <Tr key={article.uuid}>
                  <Td
                    style={{
                      minWidth: 260,
                      maxWidth: 420,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    <ArticleCell>
                      <img
                        src={article.coverImage || '/imgs/no_picture.svg'}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = '/imgs/no_picture.svg'
                        }}
                      />
                      <div>
                        <Typography variant="body" style={{ fontWeight: 700 }}>
                          <Link
                            to="/admin/articles/$articleId"
                            params={{ articleId: article.uuid }}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            {article.title}
                          </Link>
                        </Typography>
                        <Typography variant="caption" color="secondary">
                          {article.slug}
                        </Typography>
                      </div>
                    </ArticleCell>
                  </Td>
                  <Td>{article.author}</Td>
                  <Td>
                    <Badge
                      size="sm"
                      dot
                      variant={
                        article.status === 'published' ? 'success' : 'warning'
                      }
                    >
                      {article.status}
                    </Badge>
                  </Td>
                  <Td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </Td>
                  <Td>
                    <Actions>
                      <ActionIconButton
                        title="Edit article"
                        aria-label={`Edit ${article.title}`}
                        onClick={() =>
                          void navigate({
                            to: '/admin/articles/$articleId/edit',
                            params: { articleId: article.uuid },
                          })
                        }
                      >
                        <Edit02Icon size={16} />
                      </ActionIconButton>
                      <ActionIconButton
                        danger
                        title="Delete article"
                        aria-label={`Delete ${article.title}`}
                        disabled={isDeleting}
                        onClick={() => onDelete(article)}
                      >
                        <Delete02Icon size={16} />
                      </ActionIconButton>
                    </Actions>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>
    </TableCard>
  )
}
