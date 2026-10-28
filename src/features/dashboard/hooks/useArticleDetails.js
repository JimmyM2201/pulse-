import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { getArticleDetails } from '../services/dashboardService'

export function useArticleDetails(articleId, options = {}) {
  return useQuery({
    queryKey: queryKeys.articles.details(articleId),
    queryFn: () => getArticleDetails(articleId),
    select: (res) => res?.data || res,
    enabled: Boolean(articleId),
    retry: (failureCount, error) => {
      if (error?.status === 401 || error?.status === 404) return false
      return failureCount < 2
    },
    ...options,
  })
}
