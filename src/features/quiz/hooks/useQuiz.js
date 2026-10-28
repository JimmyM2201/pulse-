import { useQuery, useMutation } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import {
  getQuizzes,
  getQuizQuestion,
  submitQuizAnswer,
  getQuizScores,
} from '../services/quizService'

export function useQuizzes(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.quiz.list(params),
    queryFn: () => getQuizzes(params),
    select: (res) => res?.data?.quizzes || res?.quizzes || (Array.isArray(res) ? res : []),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  })
}

export function useQuizQuestion({ quiz_id, question_number }, options = {}) {
  return useQuery({
    queryKey: queryKeys.quiz.question(quiz_id, question_number),
    queryFn: () => getQuizQuestion({ quiz_id, question_number }),
    select: (res) => res?.data || res,
    enabled: Boolean(quiz_id && question_number),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

export function useSubmitQuizAnswer(options = {}) {
  return useMutation({
    mutationFn: async (data) => {
      const res = await submitQuizAnswer(data)
      return res?.data || res
    },
    gcTime: 0,
    ...options,
  })
}

export function useQuizScores(params = {}, options = {}) {
  return useQuery({
    queryKey: queryKeys.quiz.scores(params),
    queryFn: () => getQuizScores(params),
    select: (res) => res?.data || res || { scores: [], overall_score: null, total: 0 },
    staleTime: 1000 * 30, // 30 seconds
    ...options,
  })
}
