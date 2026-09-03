import { createFileRoute, Outlet } from '@tanstack/react-router'

const AppLayoutComponent = () => {
  return <Outlet />
}

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent,
})
