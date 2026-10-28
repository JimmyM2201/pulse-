import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { getArticles } from '../services/dashboardService'

export function useArticles(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => getArticles(params),
    select: (res) => res?.data?.articles || res?.articles || (Array.isArray(res) ? res : []),
    retry: (failureCount, error) => {
      if (error?.status === 401) return false
      return failureCount < 2
    },
    ...options,
  })
}
