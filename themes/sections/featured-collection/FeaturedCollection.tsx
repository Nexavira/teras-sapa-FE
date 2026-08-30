import React from 'react'

import styled from '@emotion/styled'
import {
  ArrowRight01Icon,
  Coffee01Icon,
  GlassesIcon,
  HandBag01Icon,
  Package01Icon,
  ShoppingBag02Icon,
  TShirtIcon,
  Wallet01Icon,
} from 'hugeicons-react'

import { BlockRenderer } from '#themes/blocks/BlockRenderer'
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
  product_image_sheet?: string
  show_quick_add?: boolean
}

interface MockProduct {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  category: string
  icon: React.ElementType
  badge?: string
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'prod_1',
    title: 'Washed Linen Overshirt',
    price: 94.0,
    compareAtPrice: 118.0,
    category: 'Serein Studio',
    icon: TShirtIcon,
    badge: 'Sale',
  },
  {
    id: 'prod_2',
    title: 'Everyday Canvas Carryall',
    price: 68.0,
    category: 'Serein Studio',
    icon: HandBag01Icon,
  },
  {
    id: 'prod_3',
    title: 'Hand-thrown Sand Vase',
    price: 52.0,
    category: 'Serein Home',
    icon: TShirtIcon,
    badge: 'New',
  },
  {
    id: 'prod_4',
    title: 'Essential Merino Crewneck',
    price: 124.0,
    category: 'Serein Studio',
    icon: GlassesIcon,
  },
  {
    id: 'prod_5',
    title: 'Full Grain Leather Cardholder',
    price: 45.0,
    category: 'Accessories',
    icon: Wallet01Icon,
  },
  {
    id: 'prod_6',
    title: 'Relaxed Fit Linen Trousers',
    price: 110.0,
    category: 'Apparel',
    icon: ShoppingBag02Icon,
  },
  {
    id: 'prod_7',
    title: 'Ceramic Pour-Over Coffee Dripper',
    price: 38.0,
    category: 'Home & Living',
    icon: Coffee01Icon,
  },
  {
    id: 'prod_8',
    title: 'Japanese Scented Soy Candle',
    price: 34.0,
    category: 'Home & Living',
    icon: Package01Icon,
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
  max-width: 720px;
  margin: 0 0 36px;
`

const CustomBlocks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
  text-align: center;
`

const Title = styled.h2`
  font-family: var(--font-heading, serif);
  font-size: clamp(2rem, 3vw, 2.75rem);
  font-weight: var(--font-heading-weight, 500);
  letter-spacing: -0.035em;
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
  gap: var(--grid-gap-horizontal, 24px);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  &:hover > div:first-of-type {
    transform: scale(1.012);
  }
`

const ImageContainer = styled.div<{
  imageSheet?: string
  imagePosition: string
}>`
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: var(--card-radius, 0px);
  background-color: #f2efe9;
  background-image: ${({ imageSheet }) =>
    imageSheet ? `url("${imageSheet}")` : 'none'};
  background-position: ${({ imagePosition }) => imagePosition};
  background-repeat: no-repeat;
  background-size: 200% 200%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(var(--color-foreground), 0.72);
  margin-bottom: 18px;
  position: relative;
  transition: transform 240ms ease;
`

const BadgeSpan = styled.span`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: #ffffff;
  color: #1d1d1b;
  font-size: 10px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
`

const CategoryLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(var(--color-foreground), 0.6);
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`

const ProductTitle = styled.h3`
  font-size: 15px;
  font-weight: 400;
  color: rgb(var(--color-foreground));
  margin: 0 0 10px 0;
  line-height: 1.4;
`

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2px;
`

const QuickAddButton = styled.button`
  background-color: transparent;
  color: rgb(var(--color-foreground));
  border: 1px solid rgba(var(--color-foreground), 0.12);
  border-radius: var(--button-radius, 0px);
  padding: 7px 13px;
  font-size: 11px;
  font-weight: 500;
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
  padding: 13px 26px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--color-secondary-button-text));
  border: 1px solid rgb(var(--color-secondary-button));
  border-radius: var(--button-radius, 0px);
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
> = ({ id, settings, blocks = {}, blockOrder = [], isEditor = false }) => {
  const {
    title = 'Featured Collection',
    description = 'Explore our handpicked curation of bestsellers and essential pieces.',
    products_to_show = 4,
    columns_desktop = '4',
    show_view_all = true,
    color_scheme = 'scheme-1',
    padding_top = 48,
    padding_bottom = 48,
    product_image_sheet = '/images/dawn/product-grid.webp',
    show_quick_add = true,
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

        {blockOrder.length > 0 && (
          <CustomBlocks>
            {blockOrder.map((blockId) => {
              const block = blocks[blockId]

              return (
                <BlockRenderer
                  block={block}
                  blockId={blockId}
                  isEditor={isEditor}
                  key={blockId}
                  sectionId={id}
                />
              )
            })}
          </CustomBlocks>
        )}

        <ProductGrid columns={columns}>
          {visibleProducts.map((product, index) => {
            const ProductIcon = product.icon
            const positions = [
              'left top',
              'right top',
              'left bottom',
              'right bottom',
            ]
            const hasCatalogImage = Boolean(product_image_sheet) && index < 4

            return (
              <ProductCard key={product.id}>
                <ImageContainer
                  imagePosition={positions[index % 4]}
                  imageSheet={hasCatalogImage ? product_image_sheet : undefined}
                >
                  {!hasCatalogImage && (
                    <ProductIcon aria-hidden="true" size={54} />
                  )}
                  {product.badge && <BadgeSpan>{product.badge}</BadgeSpan>}
                </ImageContainer>

                <CategoryLabel>{product.category}</CategoryLabel>
                <ProductTitle>{product.title}</ProductTitle>

                <CardFooter>
                  <Price
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                  />
                  {show_quick_add && (
                    <QuickAddButton type="button">Quick add</QuickAddButton>
                  )}
                </CardFooter>
              </ProductCard>
            )
          })}
        </ProductGrid>

        {show_view_all && (
          <ViewAllArea>
            <ViewAllButton href="/collections/all">
              View All Products{' '}
              <ArrowRight01Icon aria-hidden="true" size={16} />
            </ViewAllButton>
          </ViewAllArea>
        )}
      </Container>
    </SectionWrapper>
  )
}
