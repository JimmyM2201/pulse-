import { QueryClient } from '@tanstack/react-query'

/**
 * Shared TanStack QueryClient configured with approved starting defaults.
 * 
 * - retry: 1 (limit excessive failed retries)
 * - staleTime: 5 minutes (prevent rapid duplicate requests)
 * - gcTime: 10 minutes (garbage collect unused cache)
 * - refetchOnWindowFocus: false (editorial reading flow shouldn't jitter on tab switch)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
