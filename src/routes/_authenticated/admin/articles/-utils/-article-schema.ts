import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().trim().min(1, 'Enter an article title.').max(255),
  slug: z
    .string()
    .trim()
    .min(1, 'Enter a URL slug.')
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Use lowercase letters, numbers, and single hyphens.',
    ),
  author: z.string().trim().min(1, 'Enter an author name.').max(120),
  excerpt: z.string().trim().max(500, 'Keep the summary under 500 characters.'),
  content: z.string().trim().min(1, 'Write the article content.'),
  coverImage: z.union([
    z.literal(''),
    z.url({
      protocol: /^https?$/,
      message: 'Enter an http or https image URL.',
    }),
  ]),
  tags: z
    .array(z.string().trim())
    .max(20, 'Use up to 20 tags.')
    .refine(
      (tags) => tags.every((tag) => tag.length > 0 && tag.length <= 50),
      'Each tag must contain 1 to 50 characters.',
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
