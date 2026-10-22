import { useQuery } from '@tanstack/react-query'

import type { GetMediaParams, MediaItem } from '#/types/media.type'

import { mediaStorage } from './mediaStorage'

export const useGetMedia = (params: GetMediaParams = {}) => {
  return useQuery({
    queryKey: ['media', params],
    queryFn: async (): Promise<Array<MediaItem>> => {
      return mediaStorage.getMedia(params)
    },
  })
}
