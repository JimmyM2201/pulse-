import { apiClient } from '../../../lib/apiClient'

export const getQuizzes = (params = {}) =>
  apiClient.post('/user/quiz/list', {
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
    ...params,
  })

export const getQuizQuestion = (data) =>
  apiClient.post('/user/quiz/question', data)

export const submitQuizAnswer = (data) =>
  apiClient.post('/user/quiz/submit-answer', data)

export const getQuizScores = (params = {}) =>
  apiClient.post('/user/quiz/scores', {
    sort_by: 'updated_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
    ...params,
  })
