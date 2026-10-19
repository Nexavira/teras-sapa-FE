import { z } from 'zod'

export const updateTenantTemplatePageRequestSchema = z.object({
  tenant_template_page_uuid: z.string().min(1),
  tenant_template_uuid: z.string().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  template_data: z.record(z.string(), z.unknown()).nullable().optional(),
  is_active: z.number().optional(),
})

export type UpdateTenantTemplatePageBody = z.infer<
  typeof updateTenantTemplatePageRequestSchema
>
