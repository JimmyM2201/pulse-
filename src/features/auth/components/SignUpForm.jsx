import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation } from "react-router-dom"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Phone,
  ArrowRight,
  GraduationCap,
} from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Select } from "../../../components/ui/Select"
import { Button } from "../../../components/ui/Button"
import { useRegister } from "../hooks/useAuth"
import { useGoogleRegister } from "../hooks/useGoogleAuth"
import { REGEX } from "../../../constants/regex"
import { handleFirstError } from "../../../utils/form"
import { getErrorMessage } from "../../../utils/error"
import { useToast } from "../../../contexts/ToastContext"

const STANDARD_OPTIONS = [
  { value: "9th Standard", label: "9th" },
  { value: "10th Standard", label: "10th" },
  { value: "11th Standard", label: "11th" },
  { value: "12th Standard", label: "12th" },
  { value: "Undergraduate", label: "Undergraduate / College" },
  { value: "Postgraduate", label: "Postgraduate" },
  { value: "Other", label: "Other" },
]

const FIELD_ORDER = ["full_name", "email", "password", "phone"]

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const location = useLocation()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      standard: "",
      other_standard: "",
      phone: "",
    },
  })

  const selectedStandard = watch("standard")

  const { mutate: doRegister, isPending } = useRegister({
    onSuccess: () => {
      reset()
    },
    onError: (err) => {
      const message = getErrorMessage(err, "Something went wrong")
      toast.error(message)
    },
  })

  const { mutate: doGoogleRegister, isPending: isGoogleActive } = useGoogleRegister({
    onSuccess: () => {
      reset()
    },
    onError: (err) => {
      const message = getErrorMessage(err, "Something went wrong")
      toast.error(message)
    },
  })

  const isAnyActionPending = isPending || isGoogleActive

  const onSubmit = (formData) => {
    let finalStandard = formData.standard
    if (finalStandard === "Other") {
      finalStandard = formData.other_standard?.trim() || "Other"
    }

    doRegister({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      standard: finalStandard || undefined,
      phone: formData.phone ? formData.phone.trim() : "",
    })
  }

  const onInvalid = (formErrors) =>
    handleFirstError(formErrors, FIELD_ORDER, setError, clearErrors)

  const handleGoogleSignUp = () => {
    const currentValues = getValues()
    let finalStandard = currentValues.standard
    if (finalStandard === "Other") {
      finalStandard = currentValues.other_standard?.trim() || "Other"
    }

    doGoogleRegister({
      phone: currentValues.phone || undefined,
      standard: finalStandard || undefined,
    })
  }

  return (
    <div className="w-full max-w-[580px] bg-white border border-[#e5e5e5] rounded-2xl p-6 sm:p-8 font-sans">
      {/* Form Header */}
      <div className="mb-6">
        <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-[#2d5356] mb-1">
          Create Your Account
        </h1>
        <p className="text-sm text-[#525252]">
          Join Pulse and start exploring the latest news, stories and quizzes.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          required
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={isAnyActionPending}
          leftIcon={<User className="w-[18px] h-[18px] text-[#737373]" />}
          error={errors.full_name?.message}
          clearError={() => clearErrors("full_name")}
          onBeforeInput={(e) => {
            if (e.data && !/^[a-zA-Z0-9 ]+$/.test(e.data)) {
              e.preventDefault()
            }
          }}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
          }}
          {...register("full_name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
            pattern: {
              value: REGEX.ALPHANUMERIC_SPACE,
              message: "Only letters, numbers, and spaces are allowed",
            },
            validate: (value) => {
              if (!value || !value.trim()) {
                return "Full name cannot be empty or spaces only"
              }
              if (value.trim().length < 2) {
                return "Full name must be at least 2 characters"
              }
              return true
            },
            onChange: (e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
            },
          })}
        />

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
          placeholder="Create a password"
          autoComplete="new-password"
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
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        {/* Standard & Mobile Number Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Standard Select (Optional) */}
          <Select
            label="Standard"
            optional
            placeholder="Select standard"
            disabled={isAnyActionPending}
            leftIcon={<BookOpen className="w-[18px] h-[18px] text-[#737373]" />}
            options={STANDARD_OPTIONS}
            error={errors.standard?.message}
            clearError={() => clearErrors("standard")}
            {...register("standard")}
          />

          {/* Mobile Number (Optional) */}
          <Input
            label="Phone"
            optional
            type="tel"
            maxLength={10}
            inputMode="numeric"
            placeholder="Enter 10-digit phone number"
            autoComplete="tel"
            disabled={isAnyActionPending}
            leftIcon={<Phone className="w-[18px] h-[18px] text-[#737373]" />}
            error={errors.phone?.message}
            clearError={() => clearErrors("phone")}
            onBeforeInput={(e) => {
              if (e.data && !/^[0-9]+$/.test(e.data)) {
                e.preventDefault()
              }
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10)
            }}
            {...register("phone", {
              validate: (val) => {
                if (!val) return true
                if (!REGEX.PHONE.test(val)) {
                  return "Phone number must be exactly 10 digits"
                }
                return true
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10)
              },
            })}
          />
        </div>

        {/* Custom Standard Input when 'Other' is selected */}
        {selectedStandard === "Other" && (
          <Input
            label="Specify Standard"
            placeholder="Enter your standard (e.g. Diploma, PhD, etc.)"
            autoFocus
            disabled={isAnyActionPending}
            leftIcon={<GraduationCap className="w-[18px] h-[18px] text-[#737373]" />}
            error={errors.other_standard?.message}
            clearError={() => clearErrors("other_standard")}
            onBeforeInput={(e) => {
              if (e.data && !/^[a-zA-Z0-9 ]+$/.test(e.data)) {
                e.preventDefault()
              }
            }}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
            }}
            {...register("other_standard", {
              pattern: {
                value: REGEX.NO_SPECIAL_CHAR,
                message: "Special characters are not allowed",
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
              },
            })}
          />
        )}

        {/* Submit Button */}
        <div className="pt-2 sm:pt-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={isAnyActionPending}
            className="w-full py-3 h-12 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2"
          >
            <span>Create Account</span>
            {!isPending && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </form>

      {/* Or Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e5e5e5]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[#737373]">OR</span>
        </div>
      </div>

      {/* Interactive Sign up with Google button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
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
        Sign up with Google
      </Button>

      {/* Login Navigation Link */}
      <p className="text-center text-sm text-[#525252] mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          state={location.state}
          className="font-medium text-[#2d5356] hover:text-[#d09724] hover:underline transition-colors"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export default SignUpForm
