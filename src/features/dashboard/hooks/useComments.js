import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import {
  getArticleComments,
  getCommentReplies,
  addArticleComment,
  deleteArticleComment,
} from '../services/dashboardService'

export function useArticleComments(articleId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.articles.comments(articleId, params),
    queryFn: () => getArticleComments({ article_id: articleId, ...params }),
    select: (res) => {
      // Cleanly extracts comments list regardless of wrapper nesting
      const list =
        res?.data?.comments ||
        res?.comments ||
        res?.data ||
        (Array.isArray(res) ? res : [])
      const total =
        res?.data?.total ?? res?.total ?? (Array.isArray(list) ? list.length : 0)
      return { comments: Array.isArray(list) ? list : [], total }
    },
    enabled: Boolean(articleId),
    staleTime: 0,
    ...options,
  })
}

export function useCommentReplies(commentId, params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.articles.commentReplies(commentId),
    queryFn: () => getCommentReplies({ comment_id: commentId, ...params }),
    select: (res) => {
      const list =
        res?.data?.replies ||
        res?.replies ||
        res?.data ||
        (Array.isArray(res) ? res : [])
      return Array.isArray(list) ? list : []
    },
    enabled: Boolean(commentId),
    staleTime: 0,
    ...options,
  })
}

export function useAddArticleComment(articleId, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => addArticleComment({ article_id: articleId, ...data }),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['pulse', 'articles', 'comments'],
      })
      await queryClient.refetchQueries({
        queryKey: ['pulse', 'articles', 'comments'],
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.details(articleId),
      })
      options.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export function useDeleteArticleComment(articleId, options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => deleteArticleComment(data),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['pulse', 'articles', 'comments'],
      })
      await queryClient.refetchQueries({
        queryKey: ['pulse', 'articles', 'comments'],
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.details(articleId),
      })
      options.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
