import React from 'react'

import styled from '@emotion/styled'

import { collectionStorage } from '#/services/collection/collectionStorage'

import { featuredProducts } from './featuredCollectionBlocks'
import { BlockRenderer } from '#themes/blocks/BlockRenderer'
import type { FeaturedProductData } from '#themes/blocks/featured-product/FeaturedProductBlock'
import { FeaturedProductContext } from '#themes/blocks/featured-product/FeaturedProductBlock'
import type { SectionComponentProps } from '#themes/types/theme'

const SectionWrapper = styled.section<{
  paddingTop: number
  paddingBottom: number
}>`
  width: 100%;
  padding-top: ${({ paddingTop }) => `${paddingTop}px`};
  padding-bottom: ${({ paddingBottom }) => `${paddingBottom}px`};
  color: rgb(var(--color-foreground));
  background: var(--gradient-background, rgb(var(--color-background)));
`
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--grid-gap-horizontal, 24px);
  > [data-block-type] {
    min-width: 0;
  }
  > [data-block-type='button'] {
    text-align: center;
    margin-top: 16px;
  }
`

const ProductGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, minmax(0, 1fr));
  gap: var(--grid-gap-horizontal, 24px);
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

export const FeaturedCollection: React.FC<SectionComponentProps> = ({
  id,
  settings,
  blocks = {},
  blockOrder = [],
  isEditor = false,
}) => {
  const {
    collection,
    products_to_show = 4,
    product_image_sheet = '/images/dawn/product-grid.webp',
    product_data,
    columns_desktop = '4',
    color_scheme = 'scheme-1',
    padding_top = 48,
    padding_bottom = 48,
  } = settings

  const collectionData = collection
    ? collectionStorage.getCollectionByUuid(collection)
    : null

  const resolvedCollectionProducts = collectionData?.products?.map(
    (product, index) => ({
      title: product.name,
      price: product.basePrice,
      compareAtPrice: product.compareAtPrice ?? undefined,
      category: product.category ?? 'General',
      badge: product.tags?.[0] ?? undefined,
      image: product.images?.[0] ?? undefined,
      image_sheet: product.images?.[0] ? undefined : product_image_sheet,
      image_position: ['left top', 'right top', 'left bottom', 'right bottom'][
        index % 4
      ],
    }),
  )

  const products =
    product_data ??
    (resolvedCollectionProducts && resolvedCollectionProducts.length > 0
      ? resolvedCollectionProducts
      : featuredProducts.map((product, index) => ({
          ...product,
          image_sheet: index < 4 ? product_image_sheet : '',
          image_position: [
            'left top',
            'right top',
            'left bottom',
            'right bottom',
          ][index % 4],
        })))
  return (
    <SectionWrapper
      className={`color-${color_scheme} gradient`}
      data-color-scheme={color_scheme}
      paddingTop={padding_top}
      paddingBottom={padding_bottom}
    >
      <Container>
        {blockOrder.map((blockId) => {
          const block = blocks[blockId]
          if (block.type === 'featured_product') {
            return (
              <ProductGrid key={blockId} columns={Number(columns_desktop) || 4}>
                {products
                  .slice(0, products_to_show)
                  .map((product: FeaturedProductData, index: number) => (
                    <FeaturedProductContext.Provider
                      key={index}
                      value={product}
                    >
                      <BlockRenderer
                        block={block}
                        blockId={blockId}
                        sectionId={id}
                        isEditor={isEditor}
                      />
                    </FeaturedProductContext.Provider>
                  ))}
              </ProductGrid>
            )
          }
          return (
            <BlockRenderer
              key={blockId}
              block={block}
              blockId={blockId}
              sectionId={id}
              isEditor={isEditor}
            />
          )
        })}
      </Container>
    </SectionWrapper>
  )
}
