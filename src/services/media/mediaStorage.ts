import type {
  GetMediaParams,
  MediaItem,
  UpdateMediaPayload,
  UploadMediaPayload,
} from '#/types/media.type'

const MEDIA_STORAGE_KEY = 'shopiti_media_library_v1'

export const INITIAL_MEDIA_ITEMS: Array<MediaItem> = [
  {
    uuid: 'media-1',
    name: 'summer-lookbook-banner.jpg',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    size: 482000,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    alt: 'Summer Lookbook Storefront Banner',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    uuid: 'media-2',
    name: 'washed-linen-overshirt.jpg',
    url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    size: 245000,
    mimeType: 'image/jpeg',
    width: 800,
    height: 1000,
    alt: 'Washed Linen Overshirt Product Shot',
    createdAt: '2026-09-05T11:20:00.000Z',
    updatedAt: '2026-09-05T11:20:00.000Z',
  },
  {
    uuid: 'media-3',
    name: 'canvas-carryall-tote.jpg',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    size: 312000,
    mimeType: 'image/jpeg',
    width: 800,
    height: 800,
    alt: 'Everyday Canvas Carryall Tote Bag',
    createdAt: '2026-09-08T14:15:00.000Z',
    updatedAt: '2026-09-08T14:15:00.000Z',
  },
  {
    uuid: 'media-4',
    name: 'minimal-ceramic-mug.jpg',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    size: 198000,
    mimeType: 'image/jpeg',
    width: 800,
    height: 900,
    alt: 'Handcrafted Minimal Ceramic Coffee Mug',
    createdAt: '2026-09-12T16:30:00.000Z',
    updatedAt: '2026-09-12T16:30:00.000Z',
  },
  {
    uuid: 'media-5',
    name: 'artisan-leather-wallet.jpg',
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    size: 265000,
    mimeType: 'image/jpeg',
    width: 800,
    height: 800,
    alt: 'Vegetable Tanned Leather Wallet',
    createdAt: '2026-09-15T08:45:00.000Z',
    updatedAt: '2026-09-15T08:45:00.000Z',
  },
  {
    uuid: 'media-6',
    name: 'editorial-brand-story.jpg',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
    size: 520000,
    mimeType: 'image/jpeg',
    width: 1000,
    height: 667,
    alt: 'Serein Studio Brand Editorial Campaign',
    createdAt: '2026-09-18T10:10:00.000Z',
    updatedAt: '2026-09-18T10:10:00.000Z',
  },
]

const readStorage = (): Array<MediaItem> => {
  if (typeof window === 'undefined') return INITIAL_MEDIA_ITEMS
  try {
    const raw = window.localStorage.getItem(MEDIA_STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(
        MEDIA_STORAGE_KEY,
        JSON.stringify(INITIAL_MEDIA_ITEMS),
      )
      return INITIAL_MEDIA_ITEMS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    return INITIAL_MEDIA_ITEMS
  } catch (error) {
    console.error('Failed to read media storage:', error)
    return INITIAL_MEDIA_ITEMS
  }
}

const writeStorage = (items: Array<MediaItem>): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to write media storage:', error)
  }
}

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const getImageDimensions = (
  src: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ width: 800, height: 600 })
      return
    }
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      })
    }
    img.onerror = () => {
      resolve({ width: 800, height: 600 })
    }
    img.src = src
  })
}

export const mediaStorage = {
  getMedia: async (params: GetMediaParams = {}): Promise<Array<MediaItem>> => {
    const items = readStorage()
    const search = params.search?.trim().toLowerCase() || ''
    const mime = params.mimeType?.trim().toLowerCase() || ''

    return items.filter((item) => {
      if (search) {
        const matchName = item.name.toLowerCase().includes(search)
        const matchAlt = item.alt?.toLowerCase().includes(search)
        if (!matchName && !matchAlt) return false
      }
      if (mime && !item.mimeType.toLowerCase().includes(mime)) {
        return false
      }
      return true
    })
  },

  uploadMedia: async (payload: UploadMediaPayload): Promise<MediaItem> => {
    let url = payload.url || ''
    let name = payload.name || 'uploaded-image'
    let size = payload.size || 0
    let mimeType = payload.mimeType || 'image/jpeg'
    let width = payload.width
    let height = payload.height

    if (payload.file) {
      name = payload.file.name
      size = payload.file.size
      mimeType = payload.file.type || 'image/jpeg'
      url = await readFileAsDataUrl(payload.file)
      const dims = await getImageDimensions(url)
      width = dims.width
      height = dims.height
    } else if (url && (!width || !height)) {
      const dims = await getImageDimensions(url)
      width = dims.width
      height = dims.height
    }

    const newItem: MediaItem = {
      uuid: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      url,
      size,
      mimeType,
      width,
      height,
      alt: payload.alt || name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const items = readStorage()
    const nextItems = [newItem, ...items]
    writeStorage(nextItems)

    return newItem
  },

  updateMedia: async (
    uuid: string,
    updates: UpdateMediaPayload,
  ): Promise<MediaItem> => {
    const items = readStorage()
    const index = items.findIndex((i) => i.uuid === uuid)
    if (index === -1) {
      throw new Error(`Media with UUID ${uuid} not found`)
    }

    const updatedItem: MediaItem = {
      ...items[index],
      name: updates.name ?? items[index].name,
      alt: updates.alt ?? items[index].alt,
      updatedAt: new Date().toISOString(),
    }

    items[index] = updatedItem
    writeStorage(items)

    return updatedItem
  },

  deleteMedia: async (uuid: string): Promise<boolean> => {
    const items = readStorage()
    const nextItems = items.filter((i) => i.uuid !== uuid)
    writeStorage(nextItems)
    return true
  },
}
