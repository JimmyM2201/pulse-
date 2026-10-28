const AUTH_COOKIE_KEY = 'pulse-token'

function getSecureAttribute() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:'
    ? '; Secure'
    : ''
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie =
    `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${getSecureAttribute()}`
}

function clearCookie(name) {
  document.cookie =
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${getSecureAttribute()}`
}

export { AUTH_COOKIE_KEY, getCookie, setCookie, clearCookie }
