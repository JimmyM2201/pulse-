import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { getSavedArticles } from '../services/dashboardService'
import { useAuth } from '../../../contexts/AuthContext'

export function useSavedArticles(params = {}, options = {}) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.articles.saved(params),
    queryFn: () => getSavedArticles(params),
    select: (res) =>
      res?.data?.articles ||
      res?.articles ||
      res?.data ||
      (Array.isArray(res) ? res : []),
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      if (error?.status === 401) return false
      return failureCount < 2
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  })
}
