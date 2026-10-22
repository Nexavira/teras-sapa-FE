import { z } from 'zod'

export const installThemeSchema = z.object({
  tenant_uuid: z.string().min(1, 'Tenant wajib dipilih'),
  global_template_uuid: z.string().optional(),
  theme_id: z.string().min(1, 'Pilih tema untuk toko'),
  name: z.string().min(1, 'Nama tema wajib diisi').optional(),
  active_template: z.boolean(),
  is_active: z.number(),
  include_default_pages: z.boolean(),
})

export type InstallThemeFormValues = z.infer<typeof installThemeSchema>

export const initialInstallThemeFormValues: InstallThemeFormValues = {
  tenant_uuid: '',
  global_template_uuid: '',
  theme_id: '',
  name: '',
  active_template: true,
  is_active: 1,
  include_default_pages: true,
}

export const createTenantTemplateRequestSchema = z.object({
  tenant_uuid: z.string().min(1),
  global_template_uuid: z.string().optional(),
  active_template: z.boolean().optional(),
  is_active: z.number().optional(),

  template_settings: z.any().optional(),
  pages: z
    .array(
      z.object({
        title: z.string(),
        slug: z.string(),

        template_data: z.any().optional(),
        is_active: z.number().optional(),
      }),
    )
    .optional(),
})

export type CreateTenantTemplateBody = z.infer<
  typeof createTenantTemplateRequestSchema
>
