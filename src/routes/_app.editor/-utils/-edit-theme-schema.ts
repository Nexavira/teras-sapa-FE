import { z } from 'zod'

export const editThemeDataSchema = z.object({
  tenant_template_uuid: z.string().min(1, 'Tenant template UUID is required'),
  theme_title: z
    .string()
    .min(1, 'Nama tema wajib diisi')
    .max(80, 'Nama tema maksimal 80 karakter'),
  active_template: z.boolean(),
  is_active: z.number().min(0).max(1),
})

export type EditThemeDataFormValues = z.infer<typeof editThemeDataSchema>

export const initialEditThemeDataFormValues: EditThemeDataFormValues = {
  tenant_template_uuid: '',
  theme_title: '',
  active_template: false,
  is_active: 1,
}
