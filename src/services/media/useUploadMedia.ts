import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MediaItem, UploadMediaPayload } from '#/types/media.type'

import { mediaStorage } from './mediaStorage'

export const useUploadMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadMediaPayload): Promise<MediaItem> => {
      return mediaStorage.uploadMedia(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
