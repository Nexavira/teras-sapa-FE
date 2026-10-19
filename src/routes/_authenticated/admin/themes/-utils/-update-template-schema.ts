import { z } from 'zod'

export const updateTenantTemplateRequestSchema = z.object({
  tenant_template_uuid: z.string().min(1),
  global_template_uuid: z.string().optional(),
  template_settings: z.record(z.string(), z.unknown()).optional(),
  active_template: z.boolean().optional(),
  is_active: z.number().optional(),
})

export type UpdateTenantTemplateBody = z.infer<
  typeof updateTenantTemplateRequestSchema
>
