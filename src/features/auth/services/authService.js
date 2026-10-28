import { apiClient } from "../../../lib/apiClient"

async function register(data) {
  const payload = await apiClient.post("/auth/register", data)
  const accessToken = payload?.data?.access_token

  if (!accessToken) {
    throw new Error(payload?.message || "Registration succeeded but no access token was returned.")
  }

  return { accessToken }
}

async function login(data) {
  const payload = await apiClient.post("/auth/login", data)
  const accessToken = payload?.data?.access_token

  if (!accessToken) {
    throw new Error(payload?.message || "Login succeeded but no access token was returned.")
  }

  return { accessToken }
}

async function logout() {
  try {
    return await apiClient.post("/auth/logout")
  } catch {
    return null
  }
}

async function registerWithGoogle(data) {
  try {
    const payload = await apiClient.post("/auth/register-with-google", data)
    const accessToken = payload?.data?.access_token

    if (!accessToken) {
      throw new Error(payload?.message || "Google registration succeeded but no access token was returned.")
    }

    return { accessToken }
  } catch (err) {
    const errMsg = (err?.data?.message || err?.message || "").toLowerCase()
    // If account is already registered, seamlessly log in with Google
    if (
      errMsg.includes("exist") ||
      errMsg.includes("already") ||
      err?.status === 400 ||
      err?.status === 409
    ) {
      return loginWithGoogle(data)
    }
    throw err
  }
}

function extractTempToken(payload, fallbackMessage) {
  const tempToken = payload?.data?.temp_token
  if (!tempToken) {
    throw new Error(payload?.message || fallbackMessage)
  }
  return { tempToken, message: payload?.message }
}

async function forgotPassword(data) {
  const payload = await apiClient.post("/auth/forgot-password", data)
  return extractTempToken(payload, "Failed to send password reset OTP.")
}

async function verifyOtp(data) {
  const payload = await apiClient.post("/auth/verify-otp", data)
  return extractTempToken(payload, "OTP verification failed.")
}

async function changePassword(data) {
  return apiClient.post("/auth/change-password", data)
}

async function loginWithGoogle(data) {
  const payload = await apiClient.post("/auth/login-with-google", data)
  const accessToken = payload?.data?.access_token

  if (!accessToken) {
    throw new Error(payload?.message || "Google login succeeded but no access token was returned.")
  }

  return { accessToken }
}

const authService = {
  register,
  login,
  logout,
  registerWithGoogle,
  loginWithGoogle,
  forgotPassword,
  verifyOtp,
  changePassword,
}

export {
  register as registerUser,
  login as loginUser,
  logout as logoutUser,
  register,
  login,
  logout,
  registerWithGoogle,
  loginWithGoogle,
  forgotPassword,
  verifyOtp,
  changePassword,
}

export default authService
