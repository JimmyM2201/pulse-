/**
 * Centralized Query Keys for Pulse application.
 * 
 * Establishes consistent, parameter-aware query key conventions.
 * Feature modules will extend this factory with specific key hierarchies
 * as their backend endpoints become available.
 */
export const queryKeys = {
  all: ['pulse'],

  // Authentication & session (scope placeholder for auth integration)
  auth: {
    all: () => [...queryKeys.all, 'auth'],
    session: () => [...queryKeys.auth.all(), 'session'],
  },

  user: {
    all: () => [...queryKeys.all, 'user'],
    details: () => [...queryKeys.user.all(), 'details'],
  },

  articles: {
    all: () => [...queryKeys.all, 'articles'],
    list: (params = {}) => [...queryKeys.articles.all(), 'list', params],
    saved: (params = {}) => [...queryKeys.articles.all(), 'saved', params],
    details: (id) => [...queryKeys.articles.all(), 'details', id],
    comments: (articleId, params = {}) => [
      ...queryKeys.articles.all(),
      'comments',
      articleId,
      params,
    ],
    commentReplies: (commentId) => [
      ...queryKeys.articles.all(),
      'comment-replies',
      commentId,
    ],
  },

  quiz: {
    all: () => [...queryKeys.all, 'quiz'],
    list: (params = {}) => [...queryKeys.quiz.all(), 'list', params],
    question: (quiz_id, question_number) => [
      ...queryKeys.quiz.all(),
      'question',
      quiz_id,
      question_number,
    ],
    scores: (params = {}) => [...queryKeys.quiz.all(), 'scores', params],
  },
}
