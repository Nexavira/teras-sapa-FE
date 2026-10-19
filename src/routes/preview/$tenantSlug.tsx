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
})

const TenantPreviewRouteComponent = () => {
  const loaderData = Route.useLoaderData()
  const { mode, template, page, theme } = Route.useSearch()

  const activeTemplateId = template || page || loaderData.pageSlug

  return (
    <PageRenderer
      mode={mode}
      templateId={activeTemplateId}
      themeId={theme || loaderData.themeId}
      initialTemplate={loaderData.template}
      initialGlobalSettings={loaderData.globalSettings}
      tenantSlug={loaderData.tenant.slug}
      tenantName={loaderData.tenant.name}
      pageTitle={loaderData.pageTitle}
    />
  )
}

export const Route = createFileRoute('/preview/$tenantSlug')({
  validateSearch: (search) => previewSearchSchema.parse(search),
  loaderDeps: ({ search: { template, page, theme } }) => ({
    template,
    page,
    theme,
  }),
  loader: async ({ params, deps }) => {
    return await fetchTenantStorefrontData({
      tenantSlug: params.tenantSlug,
      pageSlug: deps.template || deps.page || 'home',
      themeId: deps.theme,
    })
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.pageTitle} | ${loaderData.tenant.name}`
      : 'Storefront Preview'
    const description = loaderData
      ? `${loaderData.pageTitle} page for ${loaderData.tenant.name} - Powered by Shopiti`
      : 'Teras Sapa Storefront Preview'

    return {
      meta: [
        {
          title,
        },
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
      ],
    }
  },
  component: TenantPreviewRouteComponent,
})
