import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '#/components/auth/AuthLayout'

import { RegisterForm } from './components/RegisterForm'

export const Route = createFileRoute('/register/')({
  component: RegisterPage,
})

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Mulai bangun tokomu"
      subtitle="Buat akun gratis dan siapkan etalase digital pertamamu."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
