import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mediaStorage } from './mediaStorage'

export const useDeleteMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (uuid: string): Promise<boolean> => {
      return mediaStorage.deleteMedia(uuid)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
