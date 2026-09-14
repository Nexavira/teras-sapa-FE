import type {
  BlockPreset,
  SectionInstance,
  TemplateData,
} from '#themes/types/theme'

export const featuredProducts = [
  {
    title: 'Washed Linen Overshirt',
    price: 94,
    compareAtPrice: 118,
    category: 'Serein Studio',
    badge: 'Sale',
  },
  { title: 'Everyday Canvas Carryall', price: 68, category: 'Serein Studio' },
  {
    title: 'Hand-thrown Sand Vase',
    price: 52,
    category: 'Serein Home',
    badge: 'New',
  },
  { title: 'Essential Merino Crewneck', price: 124, category: 'Serein Studio' },
  {
    title: 'Full Grain Leather Cardholder',
    price: 45,
    category: 'Accessories',
  },
  { title: 'Relaxed Fit Linen Trousers', price: 110, category: 'Apparel' },
  {
    title: 'Ceramic Pour-Over Coffee Dripper',
    price: 38,
    category: 'Home & Living',
  },
  {
    title: 'Japanese Scented Soy Candle',
    price: 34,
    category: 'Home & Living',
  },
]

/** Preserve legacy section content when converting it to editable blocks. */
export function getFeaturedCollectionPresets(
  settings: SectionInstance['settings'] = {},
): BlockPreset[] {
  const {
    title = 'Featured Collection',
    description = 'Explore our handpicked curation of bestsellers and essential pieces.',
    show_quick_add = true,
    show_view_all = true,
  } = settings
  return [
    ...(title
      ? [
          {
            type: 'heading',
            settings: {
              heading: title,
              heading_size: 'large',
              heading_tag: 'h2',
            },
          },
        ]
      : []),
    ...(description
      ? [{ type: 'text', settings: { text: description, text_style: 'body' } }]
      : []),
    {
      type: 'featured_product',
      settings: {},
      blocks: [
        { type: 'product_image', settings: { image_ratio: '1 / 1' } },
        { type: 'product_badge' },
        { type: 'product_category' },
        { type: 'product_title' },
        { type: 'product_price' },
        ...(show_quick_add
          ? [{ type: 'product_quick_add', settings: { label: 'Quick add' } }]
          : []),
      ],
    },
    ...(show_view_all
      ? [
          {
            type: 'button',
            settings: {
              button_label: 'View All Products',
              button_link: '/collections/all',
              button_style: 'outline',
            },
          },
        ]
      : []),
  ]
}

export function normalizeFeaturedCollections(
  template: TemplateData,
): TemplateData {
  const normalized = {
    ...template,
    sections: Object.fromEntries(
      Object.entries(template.sections).map(([sectionId, section]) => {
        if (
          section.type !== 'featured_collection' ||
          section.settings.content_blocks_version === 3
        )
          return [sectionId, section]
        if (section.settings.content_blocks_version === 1) {
          const blocks = { ...section.blocks }
          const productIds = (section.block_order || []).filter(
            (id) => blocks[id].type === 'featured_product',
          )
          const firstId = productIds[0]
          const productData = productIds.map((id) => {
            const { show_quick_add, quick_add_label, ...product } =
              blocks[id].settings
            return product
          })
          if (firstId) {
            const first = blocks[firstId].settings
            blocks[firstId] = {
              ...blocks[firstId],
              settings: {
                show_image: true,
                show_category: true,
                show_price: true,
                show_badge: true,
                show_quick_add: first.show_quick_add ?? true,
                quick_add_label: first.quick_add_label ?? 'Quick add',
                image_ratio: '1 / 1',
              },
            }
          }
          for (const id of productIds.slice(1)) delete blocks[id]
          return [
            sectionId,
            {
              ...section,
              blocks,
              block_order: (section.block_order || []).filter(
                (id) => !productIds.includes(id) || id === firstId,
              ),
              settings: {
                ...section.settings,
                content_blocks_version: 2,
                products_to_show: productData.length,
                product_data: productData,
              },
            },
          ]
        }
        if (section.settings.content_blocks_version === 2) {
          const blocks = { ...section.blocks }
          const productId = (section.block_order || []).find(
            (id) => blocks[id].type === 'featured_product',
          )
          if (productId) {
            const product = blocks[productId]
            const childPresets: BlockPreset[] = [
              ...(product.settings.show_image === false
                ? []
                : [
                    {
                      type: 'product_image',
                      settings: {
                        image_ratio: product.settings.image_ratio || '1 / 1',
                      },
                    },
                  ]),
              ...(product.settings.show_badge === false
                ? []
                : [{ type: 'product_badge' }]),
              ...(product.settings.show_category === false
                ? []
                : [{ type: 'product_category' }]),
              { type: 'product_title' },
              ...(product.settings.show_price === false
                ? []
                : [{ type: 'product_price' }]),
              ...(product.settings.show_quick_add === false
                ? []
                : [
                    {
                      type: 'product_quick_add',
                      settings: {
                        label: product.settings.quick_add_label || 'Quick add',
                      },
                    },
                  ]),
            ]
            const childEntries = childPresets.map((preset, index) => {
              const childId = `${productId}_${preset.type}_${index}`
              return [
                childId,
                { type: preset.type, settings: preset.settings || {} },
              ] as const
            })
            blocks[productId] = {
              ...product,
              id: productId,
              settings: {},
              blocks: Object.fromEntries(
                childEntries.map(([childId, child]) => [
                  childId,
                  { ...child, id: childId },
                ]),
              ),
              block_order: childEntries.map(([childId]) => childId),
            }
          }
          return [
            sectionId,
            {
              ...section,
              blocks,
              settings: { ...section.settings, content_blocks_version: 3 },
            },
          ]
        }
        const blocks = { ...section.blocks }
        const presets = getFeaturedCollectionPresets(section.settings)
        const order = presets.map((preset, index) => {
          const baseId = `${sectionId}_content_${index}`
          let blockId = baseId
          while (Object.hasOwn(blocks, blockId)) blockId += '_'
          const childEntries = (preset.blocks || []).map(
            (child, childIndex) => {
              const childId = `${blockId}_${child.type}_${childIndex}`
              return [
                childId,
                { type: child.type, settings: child.settings || {} },
              ] as const
            },
          )
          blocks[blockId] = {
            id: blockId,
            type: preset.type,
            settings: preset.settings || {},
            ...(childEntries.length
              ? {
                  blocks: Object.fromEntries(
                    childEntries.map(([childId, child]) => [
                      childId,
                      { ...child, id: childId },
                    ]),
                  ),
                  block_order: childEntries.map(([childId]) => childId),
                }
              : {}),
          }
          return blockId
        })
        // Existing custom content used to appear between the header and products.
        const firstProduct = presets.findIndex(
          (preset) => preset.type === 'featured_product',
        )
        order.splice(
          firstProduct < 0 ? order.length : firstProduct,
          0,
          ...(section.block_order || []),
        )
        return [
          sectionId,
          {
            ...section,
            settings: { ...section.settings, content_blocks_version: 3 },
            blocks,
            block_order: order,
          },
        ]
      }),
    ),
  }
  const needsAnotherPass = Object.values(normalized.sections).some(
    (section) =>
      section.type === 'featured_collection' &&
      section.settings.content_blocks_version !== 3,
  )
  return needsAnotherPass
    ? normalizeFeaturedCollections(normalized)
    : normalized
}
