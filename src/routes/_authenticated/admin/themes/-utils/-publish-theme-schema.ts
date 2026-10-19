import { z } from 'zod'

export const publishThemeSchema = z.object({
  tenant_template_uuid: z.string().min(1, 'Template wajib dipilih'),
})

export type PublishThemeFormValues = z.infer<typeof publishThemeSchema>

export const initialPublishThemeFormValues: PublishThemeFormValues = {
  tenant_template_uuid: '',
}
