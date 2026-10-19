import { z } from 'zod'

export const createPageSchema = z.object({
  tenant_template_uuid: z.string().min(1, 'Template toko wajib dipilih'),
  template_key: z.string().min(1, 'Pilih template halaman sumber'),
  title: z
    .string()
    .trim()
    .min(1, 'Judul halaman wajib diisi')
    .max(255, 'Judul halaman maksimal 255 karakter'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug halaman wajib diisi')
    .max(255, 'Slug halaman maksimal 255 karakter')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Gunakan huruf kecil, angka, dan tanda hubung tunggal (contoh: tentang-kami).',
    ),
  is_active: z.number(),
})

export type CreatePageFormValues = z.infer<typeof createPageSchema>

export const initialCreatePageFormValues: CreatePageFormValues = {
  tenant_template_uuid: '',
  template_key: '',
  title: '',
  slug: '',
  is_active: 1,
}

export const createTenantTemplatePageRequestSchema = z.object({
  tenant_template_uuid: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template_data: z.any().optional(),
  is_active: z.number().optional(),
})

export type CreateTenantTemplatePageBody = z.infer<
  typeof createTenantTemplatePageRequestSchema
>
