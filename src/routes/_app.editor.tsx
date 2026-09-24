import { createFileRoute } from '@tanstack/react-router'

import { z } from 'zod'

import { ThemeEditor } from './_app.editor/-components'

const ThemeEditorRouteComponent = () => {
  const { theme } = Route.useSearch()

  return (
    <ThemeEditor pageName="Home page" previewUrl="/preview" themeId={theme} />
  )
}

export const Route = createFileRoute('/_app/editor')({
  validateSearch: (search) =>
    z.object({ theme: z.string().optional() }).parse(search),
  component: ThemeEditorRouteComponent,
})
