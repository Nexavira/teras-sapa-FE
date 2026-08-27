import styled from '@emotion/styled'

import { Typography } from '#/components/ui'

interface ProductProps {
  product: {
    id: number
    uuid: string
    name: string
    status: 'active' | 'draft' | 'archived'
    type: 'physical' | 'digital'
    basePrice: string
    brand?: { name: string } | null
    category?: { name: string } | null
    productVariants?: any[]
  }
}

const CardContainer = styled.div`
  background: ${({ theme }) => (theme as any).colors?.surface || '#fff'};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid ${({ theme }) => (theme as any).colors?.border || '#e5e7eb'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const Title = styled(Typography)`
  margin: 0;
  font-weight: 600;
  color: ${({ theme }) => (theme as any).colors?.text || '#111827'};
`

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${({ status }) =>
    status === 'active'
      ? '#d1fae5'
      : status === 'draft'
        ? '#fef3c7'
        : '#f3f4f6'};
  color: ${({ status }) =>
    status === 'active'
      ? '#065f46'
      : status === 'draft'
        ? '#92400e'
        : '#374151'};
`

const Details = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => (theme as any).colors?.textMuted || '#6b7280'};
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => (theme as any).colors?.primary || '#2563eb'};
  margin-top: auto;
`

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 8px;
`

export const ProductCard = ({ product }: ProductProps) => {
  return (
    <CardContainer>
      <Header>
        <Title variant="title">{product.name}</Title>
        <StatusBadge status={product.status}>{product.status}</StatusBadge>
      </Header>

      <Details>
        {product.brand && <span>Brand: {product.brand.name}</span>}
        {product.category && <span>Category: {product.category.name}</span>}
      </Details>

      <Price>${Number(product.basePrice).toFixed(2)}</Price>

      <MetaRow>
        <span>{product.type}</span>
        <span>{product.productVariants?.length || 0} Variants</span>
      </MetaRow>
    </CardContainer>
  )
}
