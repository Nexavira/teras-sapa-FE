import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '#/-components/auth/AuthLayout'
import { LoginForm } from '#/routes/login/-schema/LoginForm'
import { hasAuthToken } from '#/services/auth/authStorage'

const LoginPage = () => {
  return (
    <AuthLayout
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan ke dashboard website kamu."
    >
      <LoginForm />
    </AuthLayout>
  )
}

export const Route = createFileRoute('/login/')({
  beforeLoad: () => {
    if (hasAuthToken()) {
      throw redirect({
        to: '/admin',
      })
    }
  },
  component: LoginPage,
})
