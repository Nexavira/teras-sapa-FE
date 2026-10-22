import type {
  Collection,
  CollectionWithProducts,
  GetCollectionsParams,
} from '#/types/collection.type'

import { productStorage } from '../product/productStorage'

const COLLECTION_STORAGE_KEY = 'shopiti_collections_data'

export const INITIAL_COLLECTIONS: Array<Collection> = [
  {
    uuid: 'col-1',
    title: 'Summer Essentials',
    slug: 'summer-essentials',
    description:
      'Breathable fabrics, relaxed cuts, and light textures curated for warmer days.',
    image:
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop&q=80',
    productUuids: ['prod-1', 'prod-2', 'prod-6'],
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'col-2',
    title: 'Home & Living',
    slug: 'home-and-living',
    description:
      'Thoughtfully crafted ceramics, homeware, and aromatics to elevate everyday living.',
    image:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80',
    productUuids: ['prod-3', 'prod-7', 'prod-8'],
    createdAt: '2026-09-02T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    uuid: 'col-3',
    title: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Our most coveted timeless pieces and community favorites.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    productUuids: ['prod-1', 'prod-3', 'prod-4', 'prod-5'],
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
]

export const collectionStorage = {
  getCollections: (params: GetCollectionsParams = {}): Array<Collection> => {
    if (typeof window === 'undefined') return INITIAL_COLLECTIONS
    try {
      const stored = window.localStorage.getItem(COLLECTION_STORAGE_KEY)
      let list: Array<Collection> = stored
        ? JSON.parse(stored)
        : INITIAL_COLLECTIONS
      if (!stored) {
        window.localStorage.setItem(
          COLLECTION_STORAGE_KEY,
          JSON.stringify(INITIAL_COLLECTIONS),
        )
      }

      if (params.search) {
        const query = params.search.toLowerCase()
        list = list.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.slug.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query),
        )
      }

      return list
    } catch {
      return INITIAL_COLLECTIONS
    }
  },

  getCollectionByUuid: (uuid: string): CollectionWithProducts | null => {
    const collections = collectionStorage.getCollections()
    const collection = collections.find((c) => c.uuid === uuid)
    if (!collection) return null

    const allProducts = productStorage.getProducts()
    const products = collection.productUuids
      .map((prodUuid) => allProducts.find((p) => p.uuid === prodUuid))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))

    return {
      ...collection,
      products,
    }
  },

  saveCollection: (
    collectionData: Omit<Collection, 'createdAt' | 'updatedAt' | 'uuid'> & {
      uuid?: string
    },
  ): Collection => {
    if (typeof window === 'undefined') {
      return {
        ...collectionData,
        uuid: collectionData.uuid || `col-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    const collections = collectionStorage.getCollections()
    const now = new Date().toISOString()
    const isUpdate = Boolean(
      collectionData.uuid &&
      collections.some((c) => c.uuid === collectionData.uuid),
    )

    let updatedCollection: Collection

    if (isUpdate) {
      const existingIndex = collections.findIndex(
        (c) => c.uuid === collectionData.uuid,
      )
      updatedCollection = {
        ...collections[existingIndex],
        ...collectionData,
        updatedAt: now,
      }
      collections[existingIndex] = updatedCollection
    } else {
      const uuid =
        collectionData.uuid ||
        `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
      updatedCollection = {
        ...collectionData,
        uuid,
        createdAt: now,
        updatedAt: now,
      }
      collections.unshift(updatedCollection)
    }

    window.localStorage.setItem(
      COLLECTION_STORAGE_KEY,
      JSON.stringify(collections),
    )
    return updatedCollection
  },

  deleteCollection: (uuid: string): boolean => {
    if (typeof window === 'undefined') return true
    const collections = collectionStorage
      .getCollections()
      .filter((c) => c.uuid !== uuid)
    window.localStorage.setItem(
      COLLECTION_STORAGE_KEY,
      JSON.stringify(collections),
    )
    return true
  },
}
