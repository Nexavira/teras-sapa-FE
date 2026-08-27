import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '#/components/auth/AuthLayout'

import { RegisterForm } from './components/RegisterForm'

export const Route = createFileRoute('/register/')({
  component: RegisterPage,
})

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join us today to design your storefront."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
