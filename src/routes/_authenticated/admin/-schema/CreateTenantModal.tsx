import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight02Icon } from 'hugeicons-react'
import { useForm, useWatch } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { Button } from '#/-components/ui/primitives/Button'
import useCreateTenant from '#/services/tenant/useCreateTenant'
import { useTenantCategories } from '#/services/tenant/useTenantCategories'
import { useTenantPackages } from '#/services/tenant/useTenantPackages'
import type { TenantType } from '#/types/tenant.type'
import type { BillingCycleType } from '#/utils/billingCycle'

import { ErrorMessage, SlugPreview } from '../-components/onboarding-styles'
import { OnboardingModal } from '../-components/OnboardingModal'
import {
  Actions,
  CategoryChoice,
  CategoryChoices,
  Eyebrow,
  Footer,
  Header,
  NameFields,
  Panel,
  PanelTitle,
  Progress,
  StepLayout,
  SupportingText,
  WizardForm,
} from '../-components/tenant-wizard-styles'
import { TenantPackagePicker } from '../-components/TenantPackagePicker'
import { useOnboardingAnimations } from '../-components/useOnboardingAnimations'
import type { TenantFormValues } from '../-utils/tenant-schema'
import { initialTenantFormValues, tenantSchema } from '../-utils/tenant-schema'

export const createTenantSlug = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const chapters = ['Website kamu', 'Kategori', 'Paket']

export const CreateTenantModal = ({
  isOpen,
  onCreated,
}: {
  isOpen: boolean
  onCreated: (tenant: TenantType) => void
}) => {
  const packages = useTenantPackages({ enabled: isOpen })
  const categories = useTenantCategories({ enabled: isOpen })
  const createTenantMutation = useCreateTenant()
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(0)
  const [websiteType, setWebsiteType] = useState('commerce')
  const [billingCycle, setBillingCycle] = useState<BillingCycleType>('monthly')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rootRef = useRef<HTMLFormElement>(null)
  const slugEditedRef = useRef(false)
  const submittingRef = useRef(false)
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm<TenantFormValues>({
    defaultValues: initialTenantFormValues,
    resolver: zodResolver(tenantSchema),
  })
  const name = useWatch({ control, name: 'name' })
  const slug = useWatch({ control, name: 'slug' })
  const categoryUuid = useWatch({ control, name: 'tenant_category_uuid' })
  const packageUuid = useWatch({ control, name: 'package_uuid' })
  const selectedCategory = categories.data?.find(
    (item) => item.uuid === categoryUuid,
  )
  const selectedPackage = packages.data?.find(
    (item) => item.uuid === packageUuid,
  )
  useOnboardingAnimations(
    rootRef,
    step,
    isOpen,
    `${categories.data?.map((item) => item.uuid).join(',')}:${websiteType}:${billingCycle}:${packages.data?.map((item) => item.uuid).join(',')}`,
    `${categoryUuid}:${packageUuid}`,
  )

  useEffect(() => {
    if (packages.data?.length) {
      const types = [...new Set(packages.data.map((pkg) => pkg.website_type))]
      if (!types.includes(websiteType)) {
        setWebsiteType(types[0])
      }
    }
  }, [packages.data, websiteType])

  useEffect(() => {
    if (isOpen && step > 0) headingRef.current?.focus()
  }, [step, isOpen])

  useEffect(() => {
    if (!slugEditedRef.current) setValue('slug', createTenantSlug(name))
  }, [name, setValue])

  const goNext = async () => {
    const fields: Array<keyof TenantFormValues> =
      step === 0 ? ['name', 'slug'] : ['tenant_category_uuid']
    if (!(await trigger(fields, { shouldFocus: true }))) return
    if (step === 1 && (!selectedCategory || categories.isError)) {
      setError('tenant_category_uuid', {
        message: 'Pilih kategori website yang tersedia.',
      })
      return
    }
    setStep(step + 1)
  }

  const submitTenant = async (values: TenantFormValues) => {
    if (submittingRef.current) return
    if (
      !selectedPackage ||
      selectedPackage.website_type !== websiteType ||
      packages.isError
    ) {
      setError('package_uuid', {
        message: 'Pilih paket yang tersedia untuk melanjutkan.',
      })
      return
    }
    submittingRef.current = true
    setFormError('')
    try {
      const tenant = await createTenantMutation.mutateAsync(values)
      onCreated(tenant)
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Website belum berhasil dibuat. Silakan coba lagi.',
      )
    } finally {
      submittingRef.current = false
    }
  }

  if (!isOpen) return null

  const titles = [
    'Apa nama website kamu?',
    `${name.trim() || 'Website kamu'} akan membahas apa?`,
    'Siap memulai langkah pertamamu?',
  ]
  const descriptions = [
    'Setiap ide punya cerita. Yuk, beri nama untuk website yang ingin kamu wujudkan.',
    'Pilih kategori yang paling sesuai dengan bidang, topik, atau konten website kamu.',
    'Pilih jenis website sesuai kebutuhanmu, dari profil perusahaan, blog, hingga toko online. Lalu tentukan paket untuk memulai.',
  ]

  return (
    <OnboardingModal
      fullScreen
      hideHeader
      title="Yuk, wujudkan website kamu"
      description="Buat website kamu dalam tiga langkah: nama, kategori, dan paket."
    >
      <WizardForm
        ref={rootRef}
        lang="id"
        noValidate
        onSubmit={(event) => {
          if (step < 2) {
            event.preventDefault()
            void goNext()
          } else {
            void handleSubmit(submitTenant)(event)
          }
        }}
      >
        <Header>
          <strong>
            TerasSapa<span aria-hidden="true">.</span>
          </strong>
          <Progress aria-label="Progres pembuatan website">
            {chapters.map((chapter, index) => (
              <li
                key={chapter}
                aria-current={step === index ? 'step' : undefined}
              >
                <b aria-hidden="true">{index < step ? '✓' : index + 1}</b>
                <span>{chapter}</span>
              </li>
            ))}
          </Progress>
          <span>Langkah {step + 1} dari 3</span>
        </Header>
        <StepLayout>
          <Panel key={step} aria-labelledby="chapter-title">
            <div>
              <Eyebrow data-chapter-eyebrow>
                {
                  [
                    'Awal sebuah cerita',
                    'Tentang website kamu',
                    'Saatnya bertumbuh',
                  ][step]
                }
              </Eyebrow>
              <PanelTitle
                id="chapter-title"
                ref={headingRef}
                tabIndex={-1}
                aria-label={titles[step]}
              >
                {titles[step].split(' ').map((word, index) => (
                  <span key={index} aria-hidden="true">
                    <span data-chapter-word>{word}</span>{' '}
                  </span>
                ))}
              </PanelTitle>
              <SupportingText data-chapter-fade>
                {descriptions[step]}
              </SupportingText>
            </div>
            {step === 0 && (
              <NameFields data-chapter-fade>
                <TextInput
                  autoFocus
                  control={control}
                  label="Nama website"
                  name="name"
                  placeholder="Contoh: Ruang Cerita"
                  size="sm"
                  required
                  variant="default"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect="off"
                  control={control}
                  label="URL website"
                  name="slug"
                  onChangeCapture={() => {
                    slugEditedRef.current = true
                  }}
                  placeholder="ruang-cerita"
                  size="sm"
                  spellCheck={false}
                  variant="default"
                />
                <SlugPreview>
                  Website kamu bisa dikunjungi di:{' '}
                  <strong>{slug || 'website-kamu'}.terassapa.com</strong>
                </SlugPreview>
              </NameFields>
            )}
            {step === 1 && (
              <>
                {categories.isPending ? (
                  <SupportingText role="status">
                    Sedang menyiapkan pilihan kategori…
                  </SupportingText>
                ) : categories.isError ? (
                  <ErrorMessage role="alert">
                    Kategori website belum berhasil dimuat.{' '}
                    <Button
                      type="button"
                      variant="text"
                      size="sm"
                      onClick={() => void categories.refetch()}
                    >
                      Coba lagi
                    </Button>
                  </ErrorMessage>
                ) : !categories.data.length ? (
                  <SupportingText role="status">
                    Kategori website belum tersedia.{' '}
                    <Button
                      type="button"
                      variant="text"
                      size="sm"
                      onClick={() => void categories.refetch()}
                    >
                      Coba lagi
                    </Button>
                  </SupportingText>
                ) : (
                  <CategoryChoices
                    role="group"
                    aria-label="Kategori website"
                    aria-describedby={
                      errors.tenant_category_uuid ? 'category-error' : undefined
                    }
                  >
                    {categories.data.map((category) => (
                      <CategoryChoice
                        data-onboarding-choice
                        key={category.uuid}
                        type="button"
                        aria-pressed={categoryUuid === category.uuid}
                        onClick={() =>
                          setValue('tenant_category_uuid', category.uuid, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                      >
                        {category.name}
                        <span aria-hidden="true">
                          {categoryUuid === category.uuid ? '✓' : '↗'}
                        </span>
                      </CategoryChoice>
                    ))}
                  </CategoryChoices>
                )}
                {errors.tenant_category_uuid && (
                  <ErrorMessage id="category-error" role="alert">
                    {errors.tenant_category_uuid.message}
                  </ErrorMessage>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <TenantPackagePicker
                  query={packages}
                  websiteType={websiteType}
                  onWebsiteTypeChange={(type) => {
                    setWebsiteType(type)
                    setValue('package_uuid', '', { shouldValidate: false })
                    setFormError('')
                  }}
                  billingCycle={billingCycle}
                  onBillingCycleChange={(cycle) => {
                    setBillingCycle(cycle)
                    setValue('package_uuid', '', { shouldValidate: false })
                    setFormError('')
                  }}
                  selectedPackageUuid={packageUuid}
                  disabled={createTenantMutation.isPending}
                  onSelect={(uuid) =>
                    setValue('package_uuid', uuid, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                {errors.package_uuid && (
                  <ErrorMessage role="alert">
                    {errors.package_uuid.message}
                  </ErrorMessage>
                )}
                {formError && (
                  <ErrorMessage role="alert">{formError}</ErrorMessage>
                )}
              </>
            )}
            <Actions data-chapter-fade>
              {step > 0 ? (
                <Button
                  type="button"
                  variant="text"
                  disabled={createTenantMutation.isPending}
                  onClick={() => {
                    setStep(step - 1)
                    setFormError('')
                  }}
                >
                  ← Kembali
                </Button>
              ) : (
                <span>Mulai dari nama yang kamu suka.</span>
              )}
              <Button
                type="submit"
                endIcon={<ArrowRight02Icon size="1rem" />}
                isLoading={createTenantMutation.isPending}
                disabled={
                  createTenantMutation.isPending ||
                  (step === 1 &&
                    (categories.isPending ||
                      categories.isError ||
                      !categories.data.length)) ||
                  (step === 2 && (!selectedPackage || packages.isError))
                }
              >
                {step === 2 ? 'Buat website saya' : 'Lanjutkan'}
              </Button>
            </Actions>
          </Panel>
        </StepLayout>
        <Footer>Dari ide sederhana, jadi awal yang istimewa.</Footer>
      </WizardForm>
    </OnboardingModal>
  )
}
