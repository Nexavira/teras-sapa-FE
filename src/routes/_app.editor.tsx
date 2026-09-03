import { createFileRoute } from '@tanstack/react-router'

import { ThemeEditor } from './_app.editor/-components'

const ThemeEditorRouteComponent = () => {
  return <ThemeEditor pageName="Home page" previewUrl="/preview" />
}

export const Route = createFileRoute('/_app/editor')({
  component: ThemeEditorRouteComponent,
})
