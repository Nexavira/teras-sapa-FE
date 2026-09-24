import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

import { PageRenderer } from './-components/PageRenderer'

const previewSearchSchema = z.object({
  mode: z.enum(['editor', 'preview']).optional().catch('preview'),
  template: z.string().optional(),
  theme: z.string().optional(),
  sectionId: z.string().optional(),
})

const PreviewRouteComponent = () => {
  const { mode, template, theme } = Route.useSearch()

  return <PageRenderer mode={mode} templateId={template} themeId={theme} />
}

export const Route = createFileRoute('/preview/')({
  validateSearch: (search) => previewSearchSchema.parse(search),
  head: () => ({
    meta: [
      {
        title: 'Teras Sapa Storefront Preview',
      },
    ],
  }),
  component: PreviewRouteComponent,
})
