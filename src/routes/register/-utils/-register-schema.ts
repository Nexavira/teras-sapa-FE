import { z } from 'zod'

export const registerSchema = z.object({
  full_name: z.string().min(1, 'Nama lengkap wajib diisi'),
  phone_number: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi')
    .min(8, 'Kata sandi minimal 8 karakter'),
  password_confirmation: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
})

export type RegisterFormType = z.infer<typeof registerSchema>

export const initialRegisterFormValues: RegisterFormType = {
  full_name: '',
  phone_number: '',
  email: '',
  password: '',
  password_confirmation: '',
}
