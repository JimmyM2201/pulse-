import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation } from "react-router-dom"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { useLogin } from "../hooks/useAuth"
import { useGoogleLogin } from "../hooks/useGoogleAuth"
import { REGEX } from "../../../constants/regex"
import { handleFirstError } from "../../../utils/form"
import { getErrorMessage } from "../../../utils/error"
import { useToast } from "../../../contexts/ToastContext"

const FIELD_ORDER = ["email", "password"]

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const location = useLocation()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate: doLogin, isPending } = useLogin({
    onError: (err) => {
      const message = getErrorMessage(err, "Something went wrong")
      toast.error(message)
    },
  })

  const { mutate: doGoogleLogin, isPending: isGoogleActive } = useGoogleLogin({
    onError: (err) => {
      const message = getErrorMessage(err, "Something went wrong")
      toast.error(message)
    },
  })

  const isAnyActionPending = isPending || isGoogleActive

  const onSubmit = (formData) => {
    doLogin({
      email: formData.email.trim(),
      password: formData.password,
    })
  }

  const onInvalid = (formErrors) =>
    handleFirstError(formErrors, FIELD_ORDER, setError, clearErrors)

  const handleGoogleLogin = () => {
    doGoogleLogin()
  }

  return (
    <div className="w-full max-w-[480px] bg-white border border-[#e5e5e5] rounded-2xl p-8 sm:p-10 font-sans">
      {/* Form Header */}
      <div className="mb-6 sm:mb-7">
        <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-[#2d5356] mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-[#525252]">
          Enter your email and password to access your account.
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="Enter your email address"
          autoComplete="email"
          disabled={isAnyActionPending}
          leftIcon={<Mail className="w-[18px] h-[18px] text-[#737373]" />}
          error={errors.email?.message}
          clearError={() => clearErrors("email")}
          {...register("email", {
            required: "Email address is required",
            pattern: {
              value: REGEX.EMAIL,
              message: "Please enter a valid email address",
            },
          })}
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isAnyActionPending}
          leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
          error={errors.password?.message}
          clearError={() => clearErrors("password")}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#737373] hover:text-[#000000] p-1 transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-[18px] h-[18px]" />
              ) : (
                <Eye className="w-[18px] h-[18px]" />
              )}
            </button>
          }
          {...register("password", {
            required: "Password is required",
          })}
        />

        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#2d5356] hover:text-[#d09724] hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={isAnyActionPending}
            className="w-full py-3 h-12 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2"
          >
            <span>Log In</span>
            {!isPending && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </form>

      {/* Or Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e5e5e5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#737373]">OR</span>
        </div>
      </div>

      {/* Google Sign In button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        isLoading={isGoogleActive}
        disabled={isAnyActionPending}
        className="w-full py-3 h-12 text-[16px] font-medium rounded-lg gap-2 cursor-pointer"
      >
        {!isGoogleActive && (
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Log in with Google
      </Button>

      {/* Sign Up Navigation Link */}
      <p className="text-center text-sm text-[#525252] mt-4">
        Don't have an account?{" "}
        <Link
          to="/register"
          state={location.state}
          className="font-medium text-[#2d5356] hover:text-[#d09724] hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
