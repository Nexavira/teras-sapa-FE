import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '#/components/auth/AuthLayout'

import { RegisterForm } from './components/RegisterForm'

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Mulai bangun bisnismu"
      subtitle="Buat akun gratis dan siapkan etalase digital pertamamu."
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export const Route = createFileRoute('/register/')({
  component: RegisterPage,
})
