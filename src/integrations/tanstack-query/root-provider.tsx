import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const getContext = () => ({
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
      },
    },
  }),
})

const TanstackQueryProvider = ({
  children,
  context,
}: {
  children: ReactNode
  context: ReturnType<typeof getContext>
}) => (
  <QueryClientProvider client={context.queryClient}>
    {children}
  </QueryClientProvider>
)

export default TanstackQueryProvider
