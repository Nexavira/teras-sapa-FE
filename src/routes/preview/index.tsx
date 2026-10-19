import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

import { fetchTenantStorefrontData } from '#/services/cms/useGetTenantStorefront'

import { PageRenderer } from './-components/PageRenderer'

const previewSearchSchema = z.object({
  mode: z.enum(['editor', 'preview']).optional().catch('preview'),
  template: z.string().optional(),
  page: z.string().optional(),
  theme: z.string().optional(),
  sectionId: z.string().optional(),
  tenant: z.string().optional(),
})

const PreviewRouteComponent = () => {
  const loaderData = Route.useLoaderData()
  const { mode, template, page, theme } = Route.useSearch()

  return (
    <PageRenderer
      mode={mode}
      templateId={template || page || loaderData?.pageSlug}
      themeId={theme || loaderData?.themeId}
      initialTemplate={loaderData?.template}
      initialGlobalSettings={loaderData?.globalSettings}
      tenantSlug={loaderData ? loaderData.tenant.slug : undefined}
      tenantName={loaderData ? loaderData.tenant.name : undefined}
      pageTitle={loaderData?.pageTitle}
    />
  )
}

export const Route = createFileRoute('/preview/')({
  validateSearch: (search) => previewSearchSchema.parse(search),
  loaderDeps: ({ search: { tenant, template, page, theme } }) => ({
    tenant,
    template,
    page,
    theme,
  }),
  loader: async ({ deps }) => {
    if (deps.tenant) {
      return await fetchTenantStorefrontData({
        tenantSlug: deps.tenant,
        pageSlug: deps.template || deps.page || 'home',
        themeId: deps.theme,
      })
    }
    return null
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.pageTitle} | ${loaderData.tenant.name}`
          : 'Teras Sapa Storefront Preview',
      },
    ],
  }),
  component: PreviewRouteComponent,
})
