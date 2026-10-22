import { beforeEach, describe, expect, it } from 'vitest'

import { INITIAL_MEDIA_ITEMS, mediaStorage } from './mediaStorage'

describe('mediaStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads initial seeded media items', async () => {
    const items = await mediaStorage.getMedia()
    expect(items.length).toBeGreaterThanOrEqual(INITIAL_MEDIA_ITEMS.length)
    expect(items[0].uuid).toBe('media-1')
  })

  it('filters media items by search query', async () => {
    const items = await mediaStorage.getMedia({ search: 'linen' })
    expect(items).toHaveLength(1)
    expect(items[0].name).toContain('linen')
  })

  it('supports uploading media via URL and adds to storage', async () => {
    const uploaded = await mediaStorage.uploadMedia({
      url: 'https://example.com/banner.jpg',
      name: 'banner.jpg',
      alt: 'Test Banner',
      size: 150000,
      mimeType: 'image/jpeg',
      width: 1000,
      height: 500,
    })

    expect(uploaded.uuid).toBeDefined()
    expect(uploaded.name).toBe('banner.jpg')
    expect(uploaded.alt).toBe('Test Banner')

    const items = await mediaStorage.getMedia()
    expect(items.some((item) => item.uuid === uploaded.uuid)).toBe(true)
  })

  it('updates media name and alt text', async () => {
    const updated = await mediaStorage.updateMedia('media-1', {
      name: 'summer-lookbook-renamed.jpg',
      alt: 'Updated Alt Text',
    })

    expect(updated.name).toBe('summer-lookbook-renamed.jpg')
    expect(updated.alt).toBe('Updated Alt Text')

    const items = await mediaStorage.getMedia({ search: 'renamed' })
    expect(items).toHaveLength(1)
  })

  it('deletes media item from storage', async () => {
    const result = await mediaStorage.deleteMedia('media-1')
    expect(result).toBe(true)

    const items = await mediaStorage.getMedia()
    expect(items.find((item) => item.uuid === 'media-1')).toBeUndefined()
  })
})
