import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().trim().min(1, 'Masukkan judul artikel.').max(255),
  slug: z
    .string()
    .trim()
    .min(1, 'Masukkan slug URL.')
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Gunakan huruf kecil, angka, dan tanda hubung tunggal.',
    ),
  author: z.string().trim().min(1, 'Masukkan nama penulis.').max(120),
  excerpt: z.string().trim().max(500, 'Ringkasan maksimal 500 karakter.'),
  content: z.string().trim().min(1, 'Tulis konten artikel.'),
  coverImage: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      message: 'Masukkan URL gambar http atau https yang valid.',
    }),
  ]),
  tags: z
    .array(z.string().trim())
    .max(20, 'Gunakan hingga 20 tag.')
    .refine(
      (tags) => tags.every((tag) => tag.length > 0 && tag.length <= 50),
      'Setiap tag harus berisi 1 hingga 50 karakter.',
    ),
  status: z.enum(['draft', 'published']),
})

export type ArticleFormValues = z.infer<typeof articleSchema>

export const initialArticleFormValues: ArticleFormValues = {
  title: '',
  slug: '',
  author: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [],
  status: 'draft',
}

export const createArticleSlug = (title: string) =>
  title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const parseArticleTags = (value: string) => [
  ...new Set(
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
]
