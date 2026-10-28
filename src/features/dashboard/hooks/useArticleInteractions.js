import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { toggleArticleLike, toggleArticleSave } from '../services/dashboardService'

export function useToggleArticleLike(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (articleId) => toggleArticleLike(articleId),
    onSuccess: (data, articleId, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.details(articleId),
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.articles.all(), 'list'],
      })
      options.onSuccess?.(data, articleId, context)
    },
    ...options,
  })
}

export function useToggleArticleSave(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (articleId) => toggleArticleSave(articleId),
    onSuccess: (data, articleId, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.details(articleId),
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.articles.all(), 'list'],
      })
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.articles.all(), 'saved'],
      })
      options.onSuccess?.(data, articleId, context)
    },
    ...options,
  })
}
