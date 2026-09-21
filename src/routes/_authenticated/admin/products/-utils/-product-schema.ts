import { z } from 'zod'

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1, 'SKU wajib diisi'),
  name: z.string().min(1, 'Nama varian wajib diisi'),
  priceOverride: z.number().nullable().optional(),
  stockQuantity: z.number().min(0, 'Stok minimal 0'),
})

export const productSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, 'Nama produk wajib diisi').max(255),
  slug: z.string().min(1, 'Slug wajib diisi').max(255),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  type: z.enum(['physical', 'digital']),
  basePrice: z.number().min(0, 'Harga minimal 0'),
  compareAtPrice: z.number().nullable().optional(),
  images: z.array(z.string()),
  category: z.string().optional(),
  vendor: z.string().optional(),
  tags: z.array(z.string()),
  variants: z.array(productVariantSchema),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const initialProductFormValues: ProductFormValues = {
  name: '',
  slug: '',
  description: '',
  status: 'active',
  type: 'physical',
  basePrice: 0,
  compareAtPrice: null,
  images: [],
  category: 'General',
  tags: [],
  variants: [],
}

export const createSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
