import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

import { ThemeEditor } from './_app.editor/-components'

const ThemeEditorRouteComponent = () => {
  const { theme, page, tenant_template, tenant } = Route.useSearch()
  const navigate = Route.useNavigate()

  const handlePageChange = (newPageSlug: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: newPageSlug,
      }),
    })
  }

  return (
    <ThemeEditor
      pageName={page ? `Page: ${page}` : 'Home page'}
      themeId={theme}
      pageSlug={page}
      tenantSlug={tenant}
      tenantTemplateUuid={tenant_template}
      onPageChange={handlePageChange}
    />
  )
}

export const Route = createFileRoute('/_app/editor')({
  validateSearch: (search) =>
    z
      .object({
        theme: z.string().optional(),
        page: z.string().optional(),
        tenant_template: z.string().optional(),
        tenant: z.string().optional(),
      })
      .parse(search),
  component: ThemeEditorRouteComponent,
})
