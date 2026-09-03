import { useState } from 'react'

import { Link } from '@tanstack/react-router'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { TextInput } from '#/components/ui/form/text-input'
import { Button } from '#/components/ui/primitives/Button'
import {
  useRegisterUser,
  useVerifyRegistrationOtp,
} from '#/services/auth/useRegisterUser'

import {
  initialOtpFormValues,
  initialRegisterFormValues,
  otpSchema,
  registerSchema,
} from '../_utils/-register-schema'

type RegisterFormValues = {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}

type RegistrationPayload = {
  full_name: string
  phone_number: string
  email: string
  password: string
  password_confirmation: string
}

type OtpFormValues = {
  otpCode: string
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const Alert = styled.div<{ $type?: 'error' | 'success' }>`
  padding: 0.8rem 0.9rem;
  border: 1px solid
    ${({ $type, theme }) =>
      $type === 'success' ? theme.colors.success : theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $type, theme }) =>
    $type === 'success' ? '#006b5c' : theme.colors.error};
  background: ${({ $type }) =>
    $type === 'success'
      ? 'rgba(50, 201, 176, 0.1)'
      : 'rgba(219, 65, 83, 0.08)'};
  font-size: 0.82rem;
  line-height: 1.5;
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

const OtpIntro = styled.div`
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.86rem;
  line-height: 1.6;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const SecondaryAction = styled.button`
  appearance: none;
  align-self: center;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.secondary.DARKER};
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const RegisterForm = () => {
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details')
  const [formError, setFormError] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [registrationPayload, setRegistrationPayload] =
    useState<RegistrationPayload | null>(null)

  const registerMutation = useRegisterUser()
  const verifyOtpMutation = useVerifyRegistrationOtp()

  const registerForm = useForm<RegisterFormValues>({
    defaultValues: initialRegisterFormValues,
    resolver: zodResolver(registerSchema),
  })
  const otpForm = useForm<OtpFormValues>({
    defaultValues: initialOtpFormValues,
    resolver: zodResolver(otpSchema),
  })

  const submitRegistration = async (values: RegisterFormValues) => {
    setFormError('')

    if (values.password !== values.confirmPassword) {
      setFormError('Konfirmasi kata sandi tidak sama.')
      return
    }

    if (values.password.length < 8) {
      setFormError('Kata sandi minimal terdiri dari 8 karakter.')
      return
    }

    const payload: RegistrationPayload = {
      full_name: values.fullName.trim(),
      phone_number: values.phoneNumber.trim(),
      email: values.email.trim(),
      password: values.password,
      password_confirmation: values.confirmPassword,
    }

    try {
      const response = await registerMutation.mutateAsync(payload)
      setRegistrationPayload(payload)
      setRegisteredEmail(response.data.email)
      setStep('otp')
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Registrasi gagal. Silakan coba kembali.',
      )
    }
  }

  const submitOtp = async ({ otpCode }: OtpFormValues) => {
    setFormError('')

    if (!/^\d{6}$/.test(otpCode)) {
      setFormError('Kode OTP harus terdiri dari 6 angka.')
      return
    }

    try {
      await verifyOtpMutation.mutateAsync({
        email: registeredEmail,
        otp_code: otpCode,
        type: 'register',
      })
      setStep('success')
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Verifikasi OTP gagal. Silakan coba kembali.',
      )
    }
  }

  const resendOtp = async () => {
    if (!registrationPayload) return

    setFormError('')
    try {
      await registerMutation.mutateAsync(registrationPayload)
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'OTP belum dapat dikirim ulang.',
      )
    }
  }

  if (step === 'success') {
    return (
      <Form as="div" data-auth-form>
        <Alert $type="success">
          Akun berhasil diverifikasi. Kamu sekarang dapat masuk menggunakan
          email dan kata sandi yang didaftarkan.
        </Alert>
        <Button
          render={<Link to="/login" />}
          size="lg"
          data-primary-auth-action
          style={{ width: '100%' }}
        >
          Lanjut ke halaman masuk
        </Button>
      </Form>
    )
  }

  if (step === 'otp') {
    return (
      <Form data-auth-form onSubmit={otpForm.handleSubmit(submitOtp)}>
        <OtpIntro>
          Masukkan kode 6 angka yang dikirim ke{' '}
          <strong>{registeredEmail}</strong>. Kode berlaku selama 10 menit.
        </OtpIntro>

        {formError && <Alert>{formError}</Alert>}

        <TextInput
          control={otpForm.control}
          name="otpCode"
          label="Kode OTP"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          required
        />

        <Button
          type="submit"
          size="lg"
          isLoading={verifyOtpMutation.isPending}
          style={{ width: '100%' }}
        >
          Verifikasi akun
        </Button>

        <SecondaryAction
          type="button"
          disabled={registerMutation.isPending}
          onClick={resendOtp}
        >
          {registerMutation.isPending ? 'Mengirim ulang...' : 'Kirim ulang OTP'}
        </SecondaryAction>
      </Form>
    )
  }

  return (
    <Form
      data-auth-form
      onSubmit={registerForm.handleSubmit(submitRegistration)}
    >
      {formError && <Alert>{formError}</Alert>}

      <FieldGrid>
        <TextInput
          control={registerForm.control}
          name="fullName"
          label="Nama lengkap"
          type="text"
          autoComplete="name"
          placeholder="Nama lengkap"
          required
          size="sm"
        />

        <TextInput
          control={registerForm.control}
          name="phoneNumber"
          label="Nomor telepon"
          type="tel"
          autoComplete="tel"
          placeholder="08xxxxxxxxxx"
          required
          size="sm"
        />
      </FieldGrid>

      <TextInput
        control={registerForm.control}
        name="email"
        label="Alamat email"
        type="email"
        autoComplete="email"
        placeholder="nama@email.com"
        required
        size="sm"
      />

      <FieldGrid>
        <TextInput
          control={registerForm.control}
          name="password"
          label="Kata sandi"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          required
          size="sm"
        />

        <TextInput
          control={registerForm.control}
          name="confirmPassword"
          label="Ulangi kata sandi"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          required
          size="sm"
        />
      </FieldGrid>

      <Button
        type="submit"
        size="sm"
        isLoading={registerMutation.isPending}
        style={{ marginTop: '0.25rem', width: '100%' }}
      >
        Buat akun
      </Button>

      <FormFooter>
        Sudah punya akun? <Link to="/login">Masuk di sini</Link>
      </FormFooter>
    </Form>
  )
}
