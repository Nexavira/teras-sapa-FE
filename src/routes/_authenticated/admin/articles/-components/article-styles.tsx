import styled from '@emotion/styled'

import { Card } from '#/-components/ui/primitives/Card'
import { theme } from '#/-components/ui/theme'

export const ArticleContainer = styled.div<{ $narrow?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(${({ $narrow }) => ($narrow ? '900px' : '1200px')}, 100%);
  min-width: 0;
  margin: 0 auto;
`

export const ArticleSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  @media (max-width: 640px) {
    padding: 16px;
  }
`

export const ArticleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
`

export const ArticleFormActions = styled(ArticleSection)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 18px 24px;
`

export const ArticleSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`

export const ArticleError = styled.div`
  padding: 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
`

export const ArticleLoading = () => (
  <ArticleSection role="status" aria-label="Loading articles">
    {[80, 55, 65].map((width) => (
      <div
        key={width}
        aria-hidden="true"
        style={{
          height: 24,
          width: `${width}%`,
          background: theme.colors.paper,
          borderRadius: 4,
        }}
      />
    ))}
    <span>Loading articles...</span>
  </ArticleSection>
)
