import React, { useState } from 'react'

import { useRouter } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

import { TextInput } from '#/components/ui/form/text-input'
import { Button } from '#/components/ui/primitives/Button'
import { useGoogleLogin } from '#/services/auth/useGoogleLogin'
import { useLoginUser } from '#/services/auth/useLoginUser'

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

export const LoginForm = () => {
  const [formError, setFormError] = useState('')

  const router = useRouter()
  const loginMutation = useLoginUser()
  const googleLoginMutation = useGoogleLogin()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: any) => {
    setFormError('')

    if (!values.email || !values.password) {
      setFormError('Please enter both email and password')
      return
    }

    try {
      await loginMutation.mutateAsync(values)
      router.navigate({ to: '/' })
    } catch (err: any) {
      setFormError(err.message || 'Invalid email or password')
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {formError && <ErrorMessage>{formError}</ErrorMessage>}

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
        placeholder="Enter your password"
        required
      />

      <Button
        type="submit"
        variant="solid"
        color="primary"
        isLoading={loginMutation.isPending}
        style={{ marginTop: '0.5rem' }}
      >
        Sign In
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
