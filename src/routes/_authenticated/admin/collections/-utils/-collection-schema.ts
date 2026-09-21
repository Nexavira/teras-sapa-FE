import { z } from 'zod'

export const collectionSchema = z.object({
  uuid: z.string().optional(),
  title: z.string().min(1, 'Judul koleksi wajib diisi').max(255),
  slug: z.string().min(1, 'Slug wajib diisi').max(255),
  description: z.string().optional(),
  image: z.string().optional(),
  productUuids: z.array(z.string()),
})

export type CollectionFormValues = z.infer<typeof collectionSchema>

export const initialCollectionFormValues: CollectionFormValues = {
  title: '',
  slug: '',
  description: '',
  image: '',
  productUuids: [],
}

export const createCollectionSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
