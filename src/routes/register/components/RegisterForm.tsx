import React, { useState } from 'react'

import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

import { TextInput } from '#/components/ui/form/text-input'
import { Button } from '#/components/ui/primitives/Button'
import { useGoogleLogin } from '#/services/auth/useGoogleLogin'
import { useRegisterUser } from '#/services/auth/useRegisterUser'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.sizes.caption};
  background: rgba(255, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.error};
`

export const RegisterForm = () => {
  const [formError, setFormError] = useState('')

  const registerMutation = useRegisterUser()
  const googleLoginMutation = useGoogleLogin()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: any) => {
    setFormError('')

    if (values.password !== values.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (values.password.length < 8) {
      setFormError('Password must be at least 8 characters long')
      return
    }

    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      // Usually you redirect here or handle success state via a router hook
      // e.g., router.navigate({ to: '/dashboard' })
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during registration')
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {formError && <ErrorMessage>{formError}</ErrorMessage>}

      <TextInput
        control={control}
        name="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        required
      />

      <TextInput
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
      />

      <TextInput
        control={control}
        name="password"
        label="Password"
        type="password"
        placeholder="Create a password"
        required
      />

      <TextInput
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
      />

      <Button
        type="submit"
        variant="solid"
        color="primary"
        isLoading={registerMutation.isPending}
        style={{ marginTop: '0.5rem' }}
      >
        Sign Up
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => googleLoginMutation.mutate()}
        isLoading={googleLoginMutation.isPending}
      >
        Continue with Google
      </Button>
    </Form>
  )
}
