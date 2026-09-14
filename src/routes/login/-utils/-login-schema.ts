import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Alamat email wajib diisi')
    .email('Email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
})

export type LoginFormType = z.infer<typeof loginSchema>

export const initialLoginFormValues: LoginFormType = {
  email: '',
  password: '',
}
