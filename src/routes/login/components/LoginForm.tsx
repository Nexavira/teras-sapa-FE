import { useState } from 'react'

import { Link, useRouter } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { useForm } from 'react-hook-form'

import { TextInput } from '#/components/ui/form/text-input'
import { Button } from '#/components/ui/primitives/Button'
import { useLoginUser } from '#/services/auth/useLoginUser'

type LoginFormValues = {
  email: string
  password: string
}

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

const FormFooter = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.85rem;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.primary.DEFAULT};
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
`

export const LoginForm = () => {
  const [formError, setFormError] = useState('')

  const router = useRouter()
  const loginMutation = useLoginUser()

  const { control, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setFormError('')

    if (!values.email || !values.password) {
      setFormError('Masukkan email dan kata sandi.')
      return
    }

    try {
      await loginMutation.mutateAsync(values)
      await router.navigate({ to: '/admin' })
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Email atau password tidak valid.',
      )
    }
  }

  return (
    <Form data-auth-form onSubmit={handleSubmit(onSubmit)}>
      {formError && <ErrorMessage>{formError}</ErrorMessage>}

      <TextInput
        control={control}
        name="email"
        label="Alamat email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        required
        size="sm"
      />

      <TextInput
        control={control}
        name="password"
        label="Kata sandi"
        type="password"
        autoComplete="current-password"
        placeholder="Masukkan kata sandi"
        required
        size="sm"
      />

      <Button
        type="submit"
        variant="solid"
        color="primary"
        isLoading={loginMutation.isPending}
        size="lg"
        style={{ marginTop: '0.5rem', width: '100%' }}
      >
        Masuk
      </Button>

      <FormFooter>
        Belum punya akun? <Link to="/register">Daftar sekarang</Link>
      </FormFooter>
    </Form>
  )
}
