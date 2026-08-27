import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '#/components/auth/AuthLayout'
// import { authClient } from '#/integrations/better-auth/client'
import { LoginForm } from '#/routes/login/components/LoginForm'

const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your dashboard."
    >
      <LoginForm />
    </AuthLayout>
  )
}

export const Route = createFileRoute('/login/')({
  beforeLoad: async () => {
    // const { data: session } = await authClient.getSession()
    const session = true
    if (session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LoginPage,
})
