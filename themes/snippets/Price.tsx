import React from 'react'

import styled from '@emotion/styled'

export interface PriceProps {
  price: number
  compareAtPrice?: number
  currency?: string
  showBadge?: boolean
}

const PriceWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`

const RegularPrice = styled.span<{ isOnSale?: boolean }>`
  font-weight: 600;
  color: ${({ isOnSale }) => (isOnSale ? 'var(--color-error, #dc2626)' : 'inherit')};
`

const ComparePrice = styled.span`
  text-decoration: line-through;
  color: rgba(var(--color-foreground), 0.5);
  font-size: 12px;
`

const SaleBadge = styled.span`
  background-color: var(--color-error, #dc2626);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
`

/**
 * Price Snippet
 * Snippets are developer-facing, reusable UI helpers without schemas or direct theme customizer exposure.
 */
export const Price: React.FC<PriceProps> = ({
  price,
  compareAtPrice,
  currency = '$',
  showBadge = true,
}) => {
  const isOnSale = compareAtPrice !== undefined && compareAtPrice > price

  return (
    <PriceWrapper>
      <RegularPrice isOnSale={isOnSale}>
        {currency}
        {price.toFixed(2)}
      </RegularPrice>

      {isOnSale && compareAtPrice && (
        <>
          <ComparePrice>
            {currency}
            {compareAtPrice.toFixed(2)}
          </ComparePrice>
          {showBadge && <SaleBadge>Sale</SaleBadge>}
        </>
      )}
    </PriceWrapper>
  )
}
