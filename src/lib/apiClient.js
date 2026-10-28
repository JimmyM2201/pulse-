import axios from 'axios'
import { env } from '../config/env'
import { AUTH_COOKIE_KEY, getCookie, clearCookie } from '../utils/cookies'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    // 'ngrok-skip-browser-warning': 'true',
  },
})

const AUTH_401_EXEMPT_PATHS = [
  '/auth/register',
  '/auth/login',
  '/auth/register-with-google',
  '/auth/login-with-google',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/change-password',
  '/auth/logout',
]

function isAuthExemptRequest(url = '') {
  return AUTH_401_EXEMPT_PATHS.some((path) => url.includes(path))
}

function getRequestAuthorization(headers) {
  if (!headers) return undefined
  if (typeof headers.get === 'function') {
    return headers.get('Authorization') || headers.get('authorization')
  }
  return headers.Authorization || headers.authorization
}

let onUnauthorized = null
let isHandlingUnauthorized = false

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function handleUnauthorizedSession() {
  if (isHandlingUnauthorized) return
  isHandlingUnauthorized = true

  try {
    clearCookie(AUTH_COOKIE_KEY)
    onUnauthorized?.()
  } finally {
    setTimeout(() => {
      isHandlingUnauthorized = false
    }, 1000)
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getCookie(AUTH_COOKIE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const hadAccessToken = Boolean(getRequestAuthorization(error.config?.headers))

    if (status === 401 && hadAccessToken && !isAuthExemptRequest(url)) {
      handleUnauthorizedSession()
    }

    const responseData = error.response?.data
    const customError = new Error(
      responseData?.message || error.message || 'An unexpected error occurred'
    )
    customError.status = status
    customError.data = responseData
    return Promise.reject(customError)
  }
)

export default apiClient
