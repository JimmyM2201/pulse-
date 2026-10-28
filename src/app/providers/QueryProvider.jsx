import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../lib/queryClient'

/**
 * Application-level TanStack Query Provider.
 * Wraps the component tree with the centralized queryClient instance.
 */
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
