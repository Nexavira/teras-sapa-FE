import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { TextareaProps } from '#/-components/ui/primitives/Textarea'
import { ThemeProvider } from '#/-components/ui/ThemeProvider'

import { ArticleForm } from './ArticleForm'

// The unit project does not load the Emotion compiler needed by the shared
// textarea's component selectors. Keep its native field behavior for form tests.
vi.mock('#/-components/ui/primitives/Textarea', () => ({
  Textarea: ({
    label,
    error,
    helperText,
    variant: _variant,
    ...props
  }: TextareaProps) => {
    void _variant
    return (
      <label>
        {label}
        <textarea {...props} />
        {error || helperText}
      </label>
    )
  },
}))

afterEach(cleanup)

const setup = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <ThemeProvider>
      <ArticleForm onSubmit={onSubmit} onCancel={vi.fn()} />
    </ThemeProvider>,
  )
  return onSubmit
}
const change = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('article form', () => {
  it('validates required fields before saving', async () => {
    const submit = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Create article' }))
    await screen.findByText('Enter an article title.')
    expect(submit).not.toHaveBeenCalled()
  })

  it('generates a slug, preserves a custom slug, and submits parsed tags and status', async () => {
    const submit = setup()
    change('Title', 'Our New Collection')
    expect(screen.getByLabelText<HTMLInputElement>('URL slug').value).toBe(
      'our-new-collection',
    )
    change('URL slug', 'custom-slug')
    change('Title', 'Our Updated Collection')
    expect(screen.getByLabelText<HTMLInputElement>('URL slug').value).toBe(
      'custom-slug',
    )
    change('Author', 'Store team')
    change('Content', 'First paragraph.\n\nSecond paragraph.')
    change('Tags (comma-separated)', 'News, Collections, News')
    change('Status', 'published')
    fireEvent.click(screen.getByRole('button', { name: 'Create article' }))
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Our Updated Collection',
          slug: 'custom-slug',
          status: 'published',
          tags: ['News', 'Collections'],
        }),
      ),
    )
  })

  it('keeps entered content after a save error and renders preview as text', async () => {
    setup(vi.fn().mockRejectedValue(new Error('Could not save articles.')))
    change('Title', 'News')
    change('Author', 'Store team')
    change('Content', '<script>alert("unsafe")</script>')
    fireEvent.click(screen.getByRole('button', { name: 'Preview article' }))
    expect(screen.getByRole('article').querySelector('script')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Create article' }))
    expect((await screen.findByRole('alert')).textContent).toBe(
      'Could not save articles.',
    )
    expect(
      screen.getByLabelText<HTMLTextAreaElement>('Content').value,
    ).toContain('<script>')
  })
})
