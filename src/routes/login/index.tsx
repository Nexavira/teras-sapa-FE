import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '#/components/auth/AuthLayout'
import { LoginForm } from '#/routes/login/components/LoginForm'
import { hasAuthToken } from '#/services/auth/authStorage'

const LoginPage = () => {
  return (
    <AuthLayout
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan ke dashboard tokomu."
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
