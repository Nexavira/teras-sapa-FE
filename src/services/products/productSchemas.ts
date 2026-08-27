import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  description: z.string().optional(),
  type: z.enum(['physical', 'digital']),
  status: z.enum(['active', 'draft', 'archived']),
  basePrice: z.string().min(1, 'Price is required'),
  brandId: z.number().optional(),
  categoryId: z.number().optional(),
  attributes: z.record(z.string(), z.unknown()),
  variants: z.array(
    z.object({
      sku: z.string().min(1, 'SKU is required'),
      name: z.string().min(1, 'Variant name is required'),
      priceOverride: z.string().optional(),
      stockQuantity: z.number(),
      attributes: z.record(z.string(), z.unknown()),
    }),
  ),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
