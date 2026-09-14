import { z } from 'zod'

export const otpSchema = z.object({
  otp_code: z.string().min(1, 'Kode OTP wajib diisi'),
})

export type OtpFormType = z.infer<typeof otpSchema>

export const initialOtpFormValues: OtpFormType = {
  otp_code: '',
}

export const sendOtpSchema = z.object({
  email: z.string().email('Email tidak valid'),
  type: z.enum(['register', 'forgot_password', 'reset_password']),
})

export const verifyOtpSchema = sendOtpSchema.extend(otpSchema.shape)

export type SendOtpParams = z.infer<typeof sendOtpSchema>
export type VerifyOtpParams = z.infer<typeof verifyOtpSchema>
