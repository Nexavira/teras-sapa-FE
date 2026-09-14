import { z } from 'zod'

export const tenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama website perlu diisi dulu, ya.')
    .max(255, 'Nama website maksimal 255 karakter.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Alamat website perlu diisi dulu, ya.')
    .max(255, 'Alamat website maksimal 255 karakter.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Gunakan huruf kecil, angka, dan tanda hubung tunggal.',
    ),
  tenant_category_uuid: z
    .string()
    .trim()
    .min(1, 'Pilih kategori yang paling sesuai dengan website kamu.'),
  package_uuid: z.string().trim().min(1, 'Pilih paket untuk melanjutkan.'),
  global_template_uuid: z.string(),
  is_suspended: z.number(),
  is_trial: z.number(),
})

export type TenantFormValues = z.infer<typeof tenantSchema>

export const initialTenantFormValues: TenantFormValues = {
  name: '',
  slug: '',
  tenant_category_uuid: '',
  package_uuid: '',
  global_template_uuid: '',
  is_suspended: 0,
  is_trial: 1,
}

export const createTenantSchema = tenantSchema

export type CreateTenantBody = z.infer<typeof createTenantSchema>
