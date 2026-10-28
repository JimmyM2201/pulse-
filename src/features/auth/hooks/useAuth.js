import { useMutation } from "@tanstack/react-query"
import { useNavigate, useLocation } from "react-router-dom"
import authService from "../services/authService"
import { useAuth } from "../../../contexts/AuthContext"

export function useRegister(options = {}) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: (data) => authService.register(data),
    gcTime: 0,
    ...options,
    onSuccess: (data, variables, context) => {
      if (data?.accessToken) {
        setAuth(data.accessToken)
      }
      navigate(location.state?.from || "/dashboard", { replace: true })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export function useLogin(options = {}) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: (data) => authService.login(data),
    gcTime: 0,
    ...options,
    onSuccess: (data, variables, context) => {
      if (data?.accessToken) {
        setAuth(data.accessToken)
      }
      navigate(location.state?.from || "/dashboard", { replace: true })
      options.onSuccess?.(data, variables, context)
    },
  })
}

export function useForgotPassword(options = {}) {
  return useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
    gcTime: 0,
    ...options,
  })
}

export function useVerifyOtp(options = {}) {
  return useMutation({
    mutationFn: (data) => authService.verifyOtp(data),
    gcTime: 0,
    ...options,
  })
}

export function useChangePassword(options = {}) {
  return useMutation({
    mutationFn: (data) => authService.changePassword(data),
    gcTime: 0,
    ...options,
  })
}

export function useLogout(options = {}) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return useMutation({
    mutationFn: () => authService.logout(),
    ...options,
    onMutate: async (variables) => {
      const protectedPaths = ["/profile", "/quizzes", "/quiz", "/saved"]
      const isProtected = protectedPaths.some((p) =>
        location.pathname.startsWith(p)
      )
      if (isProtected) {
        navigate("/dashboard", { replace: true })
      }
      return options.onMutate?.(variables)
    },
    onSettled: (data, error, variables, context) => {
      const protectedPaths = ["/profile", "/quizzes", "/quiz", "/saved"]
      const isProtected = protectedPaths.some((p) =>
        location.pathname.startsWith(p)
      )
      if (isProtected) {
        navigate("/dashboard", { replace: true })
      }
      logout()
      options.onSettled?.(data, error, variables, context)
    },
  })
}
