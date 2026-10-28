import { apiClient } from '../../../lib/apiClient'

export const getArticles = (params = {}) =>
  apiClient.post('/user/article/list', {
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 20,
    offset: 0,
    ...params,
  })

export const getArticleDetails = (articleId) =>
  apiClient.get(`/user/article/details/${articleId}`)

export const toggleArticleLike = (articleId) =>
  apiClient.get('/user/article/like', { params: { article_id: articleId } })

export const toggleArticleSave = (articleId) =>
  apiClient.get('/user/article/save', { params: { article_id: articleId } })

export const getSavedArticles = (params = {}) =>
  apiClient.get('/user/article/saved', {
    params: {
      limit: 20,
      offset: 0,
      ...params,
    },
  })

export const getArticleComments = (data = {}) =>
  apiClient.post('/user/article/comment/list', {
    limit: 20,
    offset: 0,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...data,
  })

export const getCommentReplies = (data = {}) =>
  apiClient.post('/user/article/comment/replies', {
    limit: 20,
    offset: 0,
    ...data,
  })

export const addArticleComment = (data) =>
  apiClient.post('/user/article/comment', data)

export const deleteArticleComment = (data) =>
  apiClient.post('/user/article/comment/delete', data)
