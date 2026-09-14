import React, { createContext, useContext } from 'react'

import styled from '@emotion/styled'
import { Package01Icon } from 'hugeicons-react'

import { Price } from '#themes/snippets/Price'
import type { BlockComponentProps } from '#themes/types/theme'

export interface FeaturedProductData {
  title?: string
  category?: string
  price?: number
  compareAtPrice?: number
  badge?: string
  image?: string
  image_sheet?: string
  image_position?: string
}

export const FeaturedProductContext = createContext<FeaturedProductData>({})

const ProductCard = styled.div`
  position: relative;
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;

  > [data-block-type='product_price'] {
    margin-top: auto;
    padding-top: 10px;
  }
`

export const FeaturedProductBlock: React.FC<BlockComponentProps> = ({
  children,
}) => <ProductCard>{children}</ProductCard>

const ImageContainer = styled.div<{ imageRatio: string; singleImage: boolean }>`
  aspect-ratio: ${({ imageRatio }) => imageRatio};
  overflow: hidden;
  border-radius: var(--card-radius, 0px);
  background-color: #f2efe9;
  background-position: var(--product-image-position, center);
  background-repeat: no-repeat;
  background-size: ${({ singleImage }) => (singleImage ? 'cover' : '200% 200%')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--color-foreground), 0.72);
  margin-bottom: 18px;
  transition: transform 240ms ease;

  &:hover {
    transform: scale(1.012);
  }
`

export const ProductImageBlock: React.FC<BlockComponentProps> = ({
  settings,
}) => {
  const product = useContext(FeaturedProductContext)
  const source = product.image || product.image_sheet
  return (
    <ImageContainer
      imageRatio={settings.image_ratio || '1 / 1'}
      singleImage={Boolean(product.image)}
      style={
        {
          backgroundImage: source ? `url("${source}")` : undefined,
          '--product-image-position': product.image_position || 'center',
        } as React.CSSProperties
      }
    >
      {!source && <Package01Icon aria-hidden="true" size={54} />}
    </ImageContainer>
  )
}

const Badge = styled.span`
  z-index: 1;
  align-self: flex-start;
  margin: -58px 0 28px 12px;
  padding: 6px 12px;
  border-radius: 9999px;
  background: #fff;
  color: #1d1d1b;
  font-size: 10px;
  font-weight: 600;
`

export const ProductBadgeBlock: React.FC<BlockComponentProps> = () => {
  const { badge } = useContext(FeaturedProductContext)
  return badge ? <Badge>{badge}</Badge> : null
}

const Category = styled.span`
  margin-bottom: 4px;
  color: rgba(var(--color-foreground), 0.6);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const ProductCategoryBlock: React.FC<BlockComponentProps> = () => {
  const { category } = useContext(FeaturedProductContext)
  return category ? <Category>{category}</Category> : null
}

const Title = styled.h3`
  margin: 0;
  color: rgb(var(--color-foreground));
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
`

export const ProductTitleBlock: React.FC<BlockComponentProps> = () => {
  const { title } = useContext(FeaturedProductContext)
  return title ? <Title>{title}</Title> : null
}

export const ProductPriceBlock: React.FC<BlockComponentProps> = () => {
  const { price = 0, compareAtPrice } = useContext(FeaturedProductContext)
  return <Price price={price} compareAtPrice={compareAtPrice} />
}

const QuickAdd = styled.button`
  align-self: flex-end;
  margin-top: -31px;
  padding: 7px 13px;
  border: 1px solid rgba(var(--color-foreground), 0.12);
  border-radius: var(--button-radius, 0px);
  background: transparent;
  color: rgb(var(--color-foreground));
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
`

export const ProductQuickAddBlock: React.FC<BlockComponentProps> = ({
  settings,
}) => <QuickAdd type="button">{settings.label || 'Quick add'}</QuickAdd>
