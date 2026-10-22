import type { GetProductsParams, Product } from '#/types/product.type'

const PRODUCT_STORAGE_KEY = 'shopiti_products_data'

export const INITIAL_PRODUCTS: Array<Product> = [
  {
    uuid: 'prod-1',
    name: 'Washed Linen Overshirt',
    slug: 'washed-linen-overshirt',
    description:
      'Cut from premium French flax linen, this relaxed-fit overshirt gets softer with every wash. Designed with dual chest pockets and corozo nut buttons.',
    status: 'active',
    type: 'physical',
    basePrice: 94,
    compareAtPrice: 118,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Apparel',
    vendor: 'Serein Studio',
    tags: ['Sale', 'Linen', 'Summer'],
    variants: [
      {
        id: 'var-1-1',
        sku: 'WLO-S',
        name: 'Small / Natural',
        stockQuantity: 15,
      },
      {
        id: 'var-1-2',
        sku: 'WLO-M',
        name: 'Medium / Natural',
        stockQuantity: 24,
      },
      {
        id: 'var-1-3',
        sku: 'WLO-L',
        name: 'Large / Natural',
        stockQuantity: 10,
      },
    ],
    totalInventory: 49,
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-2',
    name: 'Everyday Canvas Carryall',
    slug: 'everyday-canvas-carryall',
    description:
      'Heavyweight 16oz organic cotton canvas tote with vegetable-tanned leather handles and reinforced base.',
    status: 'active',
    type: 'physical',
    basePrice: 68,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Accessories',
    vendor: 'Serein Studio',
    tags: ['Bags', 'Canvas', 'Eco'],
    variants: [
      {
        id: 'var-2-1',
        sku: 'ECC-ECRU',
        name: 'One Size / Ecru',
        stockQuantity: 32,
      },
      {
        id: 'var-2-2',
        sku: 'ECC-OLV',
        name: 'One Size / Olive',
        stockQuantity: 18,
      },
    ],
    totalInventory: 50,
    createdAt: '2026-09-02T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-3',
    name: 'Hand-thrown Sand Vase',
    slug: 'hand-thrown-sand-vase',
    description:
      'Handcrafted ceramic vase with a textured matte sand glaze. Each piece is unique with subtle variations in silhouette.',
    status: 'active',
    type: 'physical',
    basePrice: 52,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Home & Living',
    vendor: 'Serein Home',
    tags: ['New', 'Ceramics', 'Decor'],
    variants: [
      {
        id: 'var-3-1',
        sku: 'HSV-STD',
        name: 'Standard / Sand',
        stockQuantity: 14,
      },
    ],
    totalInventory: 14,
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-4',
    name: 'Essential Merino Crewneck',
    slug: 'essential-merino-crewneck',
    description:
      'Extra-fine 19.5 micron Australian merino wool spun into a lightweight, all-season knit that naturally regulates body temperature.',
    status: 'active',
    type: 'physical',
    basePrice: 124,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Apparel',
    vendor: 'Serein Studio',
    tags: ['Wool', 'Knitwear'],
    variants: [
      {
        id: 'var-4-1',
        sku: 'EMC-M-GRY',
        name: 'Medium / Charcoal',
        stockQuantity: 20,
      },
      {
        id: 'var-4-2',
        sku: 'EMC-L-GRY',
        name: 'Large / Charcoal',
        stockQuantity: 16,
      },
    ],
    totalInventory: 36,
    createdAt: '2026-09-04T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-5',
    name: 'Full Grain Leather Cardholder',
    slug: 'full-grain-leather-cardholder',
    description:
      'Minimalist pocket card sleeve crafted from full-grain vegetable-tanned leather that develops a rich patina over time.',
    status: 'active',
    type: 'physical',
    basePrice: 45,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Accessories',
    vendor: 'Serein Studio',
    tags: ['Leather', 'Accessories'],
    variants: [
      { id: 'var-5-1', sku: 'FGL-BLK', name: 'Black', stockQuantity: 40 },
      { id: 'var-5-2', sku: 'FGL-TAN', name: 'Cognac Tan', stockQuantity: 25 },
    ],
    totalInventory: 65,
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-6',
    name: 'Relaxed Fit Linen Trousers',
    slug: 'relaxed-fit-linen-trousers',
    description:
      'Breathable tailored trousers with an elasticated waistband and concealed drawcord for understated elegance and comfort.',
    status: 'active',
    type: 'physical',
    basePrice: 110,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Apparel',
    vendor: 'Serein Studio',
    tags: ['Linen', 'Summer'],
    variants: [
      { id: 'var-6-1', sku: 'RFL-30', name: '30 / Oat', stockQuantity: 12 },
      { id: 'var-6-2', sku: 'RFL-32', name: '32 / Oat', stockQuantity: 18 },
      { id: 'var-6-3', sku: 'RFL-34', name: '34 / Oat', stockQuantity: 9 },
    ],
    totalInventory: 39,
    createdAt: '2026-09-06T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-7',
    name: 'Ceramic Pour-Over Coffee Dripper',
    slug: 'ceramic-pour-over-coffee-dripper',
    description:
      'Artisanal conical coffee dripper engineered for optimal extraction and heat retention during morning brew rituals.',
    status: 'active',
    type: 'physical',
    basePrice: 38,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Home & Living',
    vendor: 'Serein Home',
    tags: ['Coffee', 'Kitchen'],
    variants: [
      {
        id: 'var-7-1',
        sku: 'CPD-WHT',
        name: 'Glazed White',
        stockQuantity: 28,
      },
    ],
    totalInventory: 28,
    createdAt: '2026-09-07T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'prod-8',
    name: 'Japanese Scented Soy Candle',
    slug: 'japanese-scented-soy-candle',
    description:
      'Hand-poured 100% natural soy wax candle infused with hinoki cypress, cedarwood, and delicate green tea botanicals.',
    status: 'draft',
    type: 'physical',
    basePrice: 34,
    compareAtPrice: null,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
    ],
    category: 'Home & Living',
    vendor: 'Serein Home',
    tags: ['Candle', 'Wellness'],
    variants: [
      { id: 'var-8-1', sku: 'JSC-8OZ', name: '8 oz Hinoki', stockQuantity: 22 },
    ],
    totalInventory: 22,
    createdAt: '2026-09-08T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
]

export const productStorage = {
  getProducts: (params: GetProductsParams = {}): Array<Product> => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS
    try {
      const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY)
      let list: Array<Product> = stored ? JSON.parse(stored) : INITIAL_PRODUCTS
      if (!stored) {
        window.localStorage.setItem(
          PRODUCT_STORAGE_KEY,
          JSON.stringify(INITIAL_PRODUCTS),
        )
      }

      if (params.search) {
        const query = params.search.toLowerCase()
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query) ||
            p.tags?.some((t) => t.toLowerCase().includes(query)),
        )
      }

      if (params.status && params.status !== 'all') {
        list = list.filter((p) => p.status === params.status)
      }

      if (params.category) {
        list = list.filter((p) => p.category === params.category)
      }

      return list
    } catch {
      return INITIAL_PRODUCTS
    }
  },

  getProductByUuid: (uuid: string): Product | null => {
    const products = productStorage.getProducts()
    return products.find((p) => p.uuid === uuid) || null
  },

  saveProduct: (
    productData: Omit<Product, 'createdAt' | 'updatedAt' | 'uuid'> & {
      uuid?: string
    },
  ): Product => {
    if (typeof window === 'undefined') {
      return {
        ...productData,
        uuid: productData.uuid || `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    const products = productStorage.getProducts()
    const now = new Date().toISOString()
    const isUpdate = Boolean(
      productData.uuid && products.some((p) => p.uuid === productData.uuid),
    )

    let updatedProduct: Product

    if (isUpdate) {
      const existingIndex = products.findIndex(
        (p) => p.uuid === productData.uuid,
      )
      updatedProduct = {
        ...products[existingIndex],
        ...productData,
        updatedAt: now,
      }
      products[existingIndex] = updatedProduct
    } else {
      const uuid =
        productData.uuid ||
        `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
      updatedProduct = {
        ...productData,
        uuid,
        createdAt: now,
        updatedAt: now,
      }
      products.unshift(updatedProduct)
    }

    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products))
    return updatedProduct
  },

  deleteProduct: (uuid: string): boolean => {
    if (typeof window === 'undefined') return true
    const products = productStorage.getProducts().filter((p) => p.uuid !== uuid)
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products))
    return true
  },
}
