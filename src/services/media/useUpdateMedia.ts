import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MediaItem, UpdateMediaPayload } from '#/types/media.type'

import { mediaStorage } from './mediaStorage'

interface UpdateMediaVariables {
  uuid: string
  payload: UpdateMediaPayload
}

export const useUpdateMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      uuid,
      payload,
    }: UpdateMediaVariables): Promise<MediaItem> => {
      return mediaStorage.updateMedia(uuid, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
