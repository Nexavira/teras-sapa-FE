import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent,
})

const AppLayoutComponent = () => {
  return <Outlet />
}
