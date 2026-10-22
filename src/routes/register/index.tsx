import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '#/-components/auth/AuthLayout'
import { hasAuthToken } from '#/services/auth/authStorage'

import { RegisterForm } from './-schema/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Mulai wujudkan idemu"
      subtitle="Buat akun gratis dan mulai website untuk perusahaan, blog, atau usaha kamu."
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export const Route = createFileRoute('/register/')({
  beforeLoad: () => {
    if (hasAuthToken()) {
      throw redirect({
        to: '/admin',
      })
    }
  },
  component: RegisterPage,
})
