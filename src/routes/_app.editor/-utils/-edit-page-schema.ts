import { z } from 'zod'

export const editPageDataSchema = z.object({
  tenant_template_page_uuid: z
    .string()
    .min(1, 'Tenant template page UUID is required'),
  tenant_template_uuid: z.string().optional(),
  title: z
    .string()
    .min(1, 'Judul halaman wajib diisi')
    .max(100, 'Judul halaman maksimal 100 karakter'),
  slug: z
    .string()
    .min(1, 'Slug URL wajib diisi')
    .max(100, 'Slug URL maksimal 100 karakter')
    .regex(
      /^[a-z0-9-_]+$/,
      'Slug hanya boleh menggunakan huruf kecil, angka, tanda strip (-), atau garis bawah (_)',
    ),
  is_active: z.number().min(0).max(1),
})

export type EditPageDataFormValues = z.infer<typeof editPageDataSchema>

export const initialEditPageDataFormValues: EditPageDataFormValues = {
  tenant_template_page_uuid: '',
  tenant_template_uuid: '',
  title: '',
  slug: '',
  is_active: 1,
}
