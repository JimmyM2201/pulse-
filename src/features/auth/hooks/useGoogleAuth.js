import { useMutation } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, googleProvider } from "../../../lib/firebase"
import authService from "../services/authService"
import { useAuth } from "../../../contexts/AuthContext"

async function getGoogleIdToken() {
  const result = await signInWithPopup(auth, googleProvider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  return credential?.idToken || (await result.user.getIdToken())
}

function isPopupDismissedError(err) {
  return (
    err?.code === "auth/popup-closed-by-user" ||
    err?.code === "auth/cancelled-popup-request"
  )
}

export function useGoogleRegister(options = {}) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: async (extraData = {}) => {
      try {
        const idToken = extraData?.id_token || (await getGoogleIdToken())
        const { id_token: _, ...rest } = extraData || {}
        return await authService.registerWithGoogle({
          id_token: idToken,
          ...rest,
        })
      } catch (err) {
        if (isPopupDismissedError(err)) {
          return null
        }
        throw err
      }
    },
    gcTime: 0,
    ...options,
    onSuccess: (data, variables, context) => {
      if (!data) return
      if (data?.accessToken) {
        setAuth(data.accessToken)
      }
      navigate(location.state?.from || "/dashboard", { replace: true })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export function useGoogleLogin(options = {}) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: async (params = {}) => {
      try {
        const idToken = params?.id_token || (await getGoogleIdToken())
        return await authService.loginWithGoogle({ id_token: idToken })
      } catch (err) {
        if (isPopupDismissedError(err)) {
          return null
        }
        throw err
      }
    },
    gcTime: 0,
    ...options,
    onSuccess: (data, variables, context) => {
      if (!data) return
      if (data?.accessToken) {
        setAuth(data.accessToken)
      }
      navigate(location.state?.from || "/dashboard", { replace: true })
      options.onSuccess?.(data, variables, context)
    },
  })
}
