import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  phoneNumber: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi')
    .min(8, 'Kata sandi minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
})

export type RegisterFormType = z.infer<typeof registerSchema>

export const initialRegisterFormValues: RegisterFormType = {
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const otpSchema = z.object({
  otpCode: z.string().min(1, 'Kode OTP wajib diisi'),
})

export type OtpFormType = z.infer<typeof otpSchema>

export const initialOtpFormValues: OtpFormType = {
  otpCode: '',
}
