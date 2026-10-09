import { useEffect, useState } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { TextInput } from '#/-components/ui/form/text-input'
import { TextareaInput } from '#/-components/ui/form/textarea-input'
import { Button } from '#/-components/ui/primitives/Button'
import { Input } from '#/-components/ui/primitives/Input'
import { Typography } from '#/-components/ui/primitives/Typography'
import { theme } from '#/-components/ui/theme'
import type { Article } from '#/types/article.type'

import {
  ArticleActions,
  ArticleError,
  ArticleFormActions,
  ArticleSection,
  ArticleSectionHeader,
} from '../-components/article-styles'
import { ArticlePreview } from '../-components/ArticlePreview'
import type { ArticleFormValues } from '../-utils/-article-schema'
import {
  articleSchema,
  createArticleSlug,
  initialArticleFormValues,
  parseArticleTags,
} from '../-utils/-article-schema'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const Fields = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const StatusLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  select {
    height: 52px;
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    padding: 0 12px;
    font: inherit;
    font-size: 16px;
    color: ${theme.colors.text.primary};
    background: ${theme.colors.white};
  }
`

export const ArticleForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: {
  initialData?: Article
  onSubmit: (values: ArticleFormValues) => Promise<unknown>
  onCancel: () => void
  isSubmitting?: boolean
}) => {
  const [preview, setPreview] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { dirtyFields, errors, isSubmitting: formPending },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData
      ? articleSchema.parse(initialData)
      : initialArticleFormValues,
  })
  const values = useWatch({ control })
  const title = values.title ?? ''
  useEffect(() => {
    if (!initialData && !dirtyFields.slug)
      setValue('slug', createArticleSlug(title))
  }, [title, initialData, dirtyFields.slug, setValue])
  const pending = isSubmitting || formPending

  return (
    <Form
      onSubmit={handleSubmit(async (data) => {
        clearErrors('root')
        try {
          await onSubmit(data)
        } catch (error) {
          setError('root', {
            message:
              error instanceof Error
                ? error.message
                : 'Tidak dapat menyimpan artikel. Silakan coba lagi.',
          })
        }
      })}
      noValidate
    >
      <ArticleActions>
        <Button
          type="button"
          variant="outline"
          color="neutral"
          aria-pressed={preview}
          onClick={() => setPreview(!preview)}
        >
          {preview ? 'Tutup pratinjau' : 'Pratinjau artikel'}
        </Button>
      </ArticleActions>
      {preview && (
        <ArticlePreview
          article={{
            ...initialArticleFormValues,
            ...values,
            tags:
              values.tags?.filter((tag): tag is string => Boolean(tag)) ?? [],
          }}
        />
      )}
      <Fields disabled={pending}>
        <ArticleSection>
          <ArticleSectionHeader>
            <Typography
              as="h2"
              variant="title"
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              Detail artikel
            </Typography>
            <Typography variant="caption" color="secondary">
              Konfigurasikan judul, slug URL, penulis, dan konten artikel.
            </Typography>
          </ArticleSectionHeader>
          <TextInput
            control={control}
            name="title"
            label="Judul"
            variant="default"
            maxLength={255}
          />
          <Grid>
            <TextInput
              control={control}
              name="slug"
              label="Slug URL"
              variant="default"
              maxLength={255}
            />
            <TextInput
              control={control}
              name="author"
              label="Penulis"
              variant="default"
              maxLength={120}
            />
          </Grid>
          <TextareaInput
            control={control}
            name="excerpt"
            label="Ringkasan (opsional)"
            variant="default"
            rows={3}
            maxLength={500}
          />
          <TextareaInput
            control={control}
            name="content"
            label="Konten"
            variant="default"
            rows={16}
            aria-describedby="article-content-help"
          />
          <Typography
            id="article-content-help"
            variant="caption"
            color="secondary"
          >
            Tulis dalam teks biasa. Paragraf dan jeda baris akan dipertahankan.
          </Typography>
        </ArticleSection>
        <ArticleSection>
          <ArticleSectionHeader>
            <Typography
              as="h2"
              variant="title"
              style={{ fontSize: '1.1rem', fontWeight: 700 }}
            >
              Organisasi dan penerbitan
            </Typography>
            <Typography variant="caption" color="secondary">
              Tambahkan gambar sampul dan tag, lalu tentukan status artikel.
            </Typography>
          </ArticleSectionHeader>
          <TextInput
            control={control}
            name="coverImage"
            label="URL gambar sampul (opsional)"
            type="url"
            variant="default"
            placeholder="https://example.com/sampul.jpg"
          />
          <Grid>
            <Controller
              control={control}
              name="tags"
              render={({ field, fieldState }) => (
                <Input
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  defaultValue={field.value.join(', ')}
                  onChange={(event) =>
                    field.onChange(parseArticleTags(event.target.value))
                  }
                  label="Tag (pisahkan dengan koma)"
                  variant="default"
                  error={fieldState.error?.message}
                  helperText="Hingga 20 tag, masing-masing maksimal 50 karakter."
                />
              )}
            />
            <StatusLabel>
              Status
              <select {...register('status')}>
                <option value="draft">Draf</option>
                <option value="published">Diterbitkan</option>
              </select>
            </StatusLabel>
          </Grid>
        </ArticleSection>
      </Fields>
      {errors.root && (
        <ArticleError role="alert">{errors.root.message}</ArticleError>
      )}
      <ArticleFormActions>
        <Button
          type="button"
          variant="outline"
          color="neutral"
          onClick={onCancel}
          disabled={pending}
        >
          Batal
        </Button>
        <Button type="submit" disabled={pending}>
          {pending
            ? 'Menyimpan...'
            : initialData
              ? 'Simpan perubahan'
              : 'Buat artikel'}
        </Button>
      </ArticleFormActions>
    </Form>
  )
}
