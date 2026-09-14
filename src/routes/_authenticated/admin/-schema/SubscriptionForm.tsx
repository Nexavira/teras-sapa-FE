import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { PackageCatalog } from '#/-components/landing/PackageCatalog'
import { Button } from '#/-components/ui/primitives/Button'
import { useTenantPackages } from '#/services/tenant/useTenantPackages'

import { ErrorMessage, Form } from '../-components/onboarding-styles'
import type { SubscriptionFormValues } from '../-utils/subscription-schema'
import {
  initialSubscriptionFormValues,
  subscriptionSchema,
} from '../-utils/subscription-schema'

export const SubscriptionForm = ({
  onSubmit,
  isPending,
  error,
}: {
  onSubmit: (values: SubscriptionFormValues) => Promise<void>
  isPending: boolean
  error?: string
}) => {
  const packages = useTenantPackages()
  const [websiteType, setWebsiteType] = useState('')
  const {
    control,
    handleSubmit,
    resetField,
    setError,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    defaultValues: initialSubscriptionFormValues,
    resolver: zodResolver(subscriptionSchema),
  })
  const selectedPackageUuid = useWatch({ control, name: 'package_uuid' })
  const selectedPackage = packages.data?.find(
    (pkg) =>
      pkg.uuid === selectedPackageUuid && pkg.website_type === websiteType,
  )

  return (
    <Form
      aria-label="Subscription package"
      onSubmit={handleSubmit(async (values) => {
        if (isPending) return
        if (!selectedPackage || packages.isError) {
          setError('package_uuid', {
            message: 'Choose an available package for your website type.',
          })
          return
        }
        await onSubmit(values)
      })}
    >
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      <Controller
        control={control}
        name="package_uuid"
        render={({ field }) => (
          <PackageCatalog
            query={packages}
            websiteType={websiteType}
            onWebsiteTypeChange={(value) => {
              if (value === websiteType) return
              setWebsiteType(value)
              resetField('package_uuid')
            }}
            selectedPackageUuid={field.value}
            disabled={isPending}
            renderAction={(pkg) => (
              <Button
                type="button"
                ref={pkg.uuid === selectedPackageUuid ? field.ref : undefined}
                aria-label={`Select ${pkg.title}`}
                aria-pressed={field.value === pkg.uuid}
                disabled={isPending}
                onClick={() => field.onChange(pkg.uuid)}
                onBlur={field.onBlur}
              >
                {field.value === pkg.uuid ? 'Selected' : 'Choose package'}
              </Button>
            )}
          />
        )}
      />
      {errors.package_uuid && (
        <ErrorMessage role="alert">{errors.package_uuid.message}</ErrorMessage>
      )}
      <Button
        type="submit"
        isLoading={isPending}
        disabled={
          isPending ||
          packages.isPending ||
          packages.isError ||
          !selectedPackage
        }
      >
        Subscribe
      </Button>
    </Form>
  )
}
