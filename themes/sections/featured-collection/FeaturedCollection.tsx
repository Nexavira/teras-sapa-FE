import React from 'react'

import styled from '@emotion/styled'

import { Price } from '#themes/snippets/Price'
import type { SectionComponentProps } from '#themes/types/theme'

export interface FeaturedCollectionSettings {
  title?: string
  description?: string
  products_to_show?: number
  columns_desktop?: string
  show_view_all?: boolean
  color_scheme?: string
  padding_top?: number
  padding_bottom?: number
}

interface MockProduct {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  category: string
  emoji: string
  badge?: string
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod_1',
    title: 'Minimalist Merino Wool Sweater',
    price: 128.0,
    compareAtPrice: 160.0,
    category: 'Apparel',
    emoji: '🧥',
    badge: 'Sale',
  },
  {
    id: 'prod_2',
    title: 'Structured Canvas Everyday Tote',
    price: 85.0,
    category: 'Accessories',
    emoji: '👜',
  },
  {
    id: 'prod_3',
    title: 'Organic Cotton Oxford Shirt',
    price: 95.0,
    category: 'Apparel',
    emoji: '👔',
    badge: 'Popular',
  },
  {
    id: 'prod_4',
    title: 'Handcrafted Acetate Sunglasses',
    price: 145.0,
    compareAtPrice: 180.0,
    category: 'Eyewear',
    emoji: '🕶️',
    badge: 'Sale',
  },
  {
    id: 'prod_5',
    title: 'Full Grain Leather Cardholder',
    price: 45.0,
    category: 'Accessories',
    emoji: '👛',
  },
  {
    id: 'prod_6',
    title: 'Relaxed Fit Linen Trousers',
    price: 110.0,
    category: 'Apparel',
    emoji: '👖',
  },
  {
    id: 'prod_7',
    title: 'Ceramic Pour-Over Coffee Dripper',
    price: 38.0,
    category: 'Home & Living',
    emoji: '☕',
  },
  {
    id: 'prod_8',
    title: 'Japanese Scented Soy Candle',
    price: 34.0,
    category: 'Home & Living',
    emoji: '🕯️',
  },
]

const SectionWrapper = styled.section<{
  paddingTop: number
  paddingBottom: number
}>`
  width: 100%;
  padding-top: ${({ paddingTop }) => `${paddingTop}px`};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px`};
  color: rgb(var(--color-foreground));
  background-color: rgb(var(--color-background));
  background: var(--gradient-background, rgb(var(--color-background)));
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`

const SectionHeader = styled.div`
  text-align: center;
  max-width: 640px;
  margin: 0 auto 40px auto;
`

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  color: rgb(var(--color-foreground));
`

const Description = styled.p`
  font-size: 1rem;
  color: rgba(var(--color-foreground), 0.75);
  line-height: 1.5;
  margin: 0;
`

const ProductGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.div`
  border-radius: var(--card-radius, 12px);
  background-color: rgb(var(--color-background));
  border: 1px solid var(--color-border, rgba(var(--color-foreground), 0.12));
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 24px rgba(var(--color-shadow), 0.08);
    border-color: rgba(var(--color-foreground), 0.24);
  }
`

const ImageContainer = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  background: var(--color-card, rgba(var(--color-foreground), 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54px;
  margin-bottom: 14px;
  position: relative;
`

const BadgeSpan = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgb(var(--color-button));
  color: rgb(var(--color-button-text));
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
`

const CategoryLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(var(--color-foreground), 0.6);
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`

const ProductTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-foreground));
  margin: 0 0 10px 0;
  line-height: 1.4;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--color-border, rgba(var(--color-foreground), 0.1));
`

const QuickAddButton = styled.button`
  background-color: rgba(var(--color-foreground), 0.06);
  color: rgb(var(--color-foreground));
  border: 1px solid rgba(var(--color-foreground), 0.12);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgb(var(--color-button));
    color: rgb(var(--color-button-text));
    border-color: rgb(var(--color-button));
  }
`

const ViewAllArea = styled.div`
  text-align: center;
  margin-top: 40px;
`

const ViewAllButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-secondary-button-text));
  border: 1px solid rgb(var(--color-secondary-button));
  border-radius: var(--button-radius, 8px);
  text-decoration: none;
  background-color: transparent;
  transition: all 0.15s ease;

  &:hover {
    background-color: rgb(var(--color-button));
    color: rgb(var(--color-button-text));
  }
`

export const FeaturedCollection: React.FC<
  SectionComponentProps<FeaturedCollectionSettings>
> = ({ settings }) => {
  const {
    title = 'Featured Collection',
    description = 'Explore our handpicked curation of bestsellers and essential pieces.',
    products_to_show = 4,
    columns_desktop = '4',
    show_view_all = true,
    color_scheme = 'scheme-1',
    padding_top = 48,
    padding_bottom = 48,
  } = settings

  const columns = parseInt(columns_desktop, 10) || 4
  const visibleProducts = MOCK_PRODUCTS.slice(0, products_to_show)

  return (
    <SectionWrapper
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      paddingTop={padding_top}
      paddingBottom={padding_bottom}
    >
      <Container>
        {(title || description) && (
          <SectionHeader>
            {title && <Title>{title}</Title>}
            {description && <Description>{description}</Description>}
          </SectionHeader>
        )}

        <ProductGrid columns={columns}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id}>
              <ImageContainer>
                {product.emoji}
                {product.badge && <BadgeSpan>{product.badge}</BadgeSpan>}
              </ImageContainer>

              <CategoryLabel>{product.category}</CategoryLabel>
              <ProductTitle>{product.title}</ProductTitle>

              <CardFooter>
                <Price
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                />
                <QuickAddButton type="button">Quick Add</QuickAddButton>
              </CardFooter>
            </ProductCard>
          ))}
        </ProductGrid>

        {show_view_all && (
          <ViewAllArea>
            <ViewAllButton href="/collections/all">
              View All Products →
            </ViewAllButton>
          </ViewAllArea>
        )}
      </Container>
    </SectionWrapper>
  )
}
