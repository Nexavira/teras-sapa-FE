import type { ReactNode } from 'react'

import styled from '@emotion/styled'

import { Button } from '#/-components/ui/primitives/Button'
import { Card } from '#/-components/ui/primitives/Card'

interface CatalogStatusProps {
  children: ReactNode
  role: 'alert' | 'status'
}

interface CatalogErrorProps {
  onRetry: () => void
}

const StatusCard = styled(Card)`
  padding: 36px 24px;
  border: 1px dashed #cddbd2;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #f5f8f5;
  color: #52655d;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: center;

  button {
    margin: 12px auto 0;
  }
`

export const CatalogStatus = ({ children, role }: CatalogStatusProps) => (
  <StatusCard role={role}>{children}</StatusCard>
)

export const CatalogError = ({ onRetry }: CatalogErrorProps) => (
  <CatalogStatus role="alert">
    Paket belum berhasil dimuat.
    <Button type="button" variant="outline" onClick={onRetry}>
      Coba lagi
    </Button>
  </CatalogStatus>
)
