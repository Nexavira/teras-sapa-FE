import { z } from 'zod'

export const subscriptionSchema = z.object({
  package_uuid: z.string().min(1, 'Choose a subscription package.'),
})
export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
export const initialSubscriptionFormValues: SubscriptionFormValues = {
  package_uuid: '',
}
export const createSubscriptionSchema = subscriptionSchema.extend({
  tenant_uuid: z.string().min(1),
  is_trial: z.literal(0),
})
export type CreateSubscriptionBody = z.infer<typeof createSubscriptionSchema>
