import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import {
  useForgotPassword,
  useVerifyOtp,
  useChangePassword,
} from "../hooks/useAuth"
import { REGEX } from "../../../constants/regex"
import { handleFirstError } from "../../../utils/form"
import { getErrorMessage } from "../../../utils/error"
import { useToast } from "../../../contexts/ToastContext"

const EMAIL_FIELDS = ["email"]
const OTP_FIELDS = ["otp"]
const PASSWORD_FIELDS = ["new_password", "confirm_password"]

export function ForgotPasswordForm() {
  const [step, setStep] = useState("email")
  const [email, setEmail] = useState("")
  const [tempToken, setTempToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const toast = useToast()
  const navigate = useNavigate()

  const emailForm = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { email: "" },
  })

  const otpForm = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { otp: "" },
  })

  const passwordForm = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { new_password: "", confirm_password: "" },
  })

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendIn])

  const { mutate: sendOtp, isPending: isSendingOtp } = useForgotPassword({
    onSuccess: (data) => {
      setTempToken(data.tempToken)
      setStep((current) => {
        if (current !== "otp") {
          otpForm.reset({ otp: "" })
        }
        return "otp"
      })
      setResendIn(60)
      toast.success(data.message || "OTP sent to your email")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Something went wrong"))
    },
  })

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp({
    onSuccess: (data) => {
      setTempToken(data.tempToken)
      setStep("password")
      passwordForm.reset({ new_password: "", confirm_password: "" })
      toast.success(data.message || "OTP verified successfully")
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Something went wrong"))
    },
  })

  const { mutate: updatePassword, isPending: isUpdatingPassword } = useChangePassword({
    onSuccess: (payload) => {
      toast.success(payload?.message || "Password changed successfully")
      navigate("/login", { replace: true })
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Something went wrong"))
    },
  })

  const busy = isSendingOtp || isVerifyingOtp || isUpdatingPassword

  const onEmailSubmit = (formData) => {
    const nextEmail = formData.email.trim()
    setEmail(nextEmail)
    sendOtp({ email: nextEmail })
  }

  const onOtpSubmit = (formData) => {
    verifyOtp({
      temp_token: tempToken,
      otp: formData.otp.trim(),
    })
  }

  const onPasswordSubmit = (formData) => {
    updatePassword({
      temp_token: tempToken,
      new_password: formData.new_password,
    })
  }

  const handleResendOtp = () => {
    if (!email || isSendingOtp || resendIn > 0) return
    sendOtp({ email })
  }

  return (
    <div className="w-full max-w-[480px] bg-white border border-[#e5e5e5] rounded-2xl p-8 sm:p-10 font-sans">
      {step === "email" && (
        <>
          <div className="mb-6 sm:mb-7">
            <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-[#2d5356] mb-1">
              Forgot Password
            </h1>
            <p className="text-sm text-[#525252]">
            We’ll email you a code to reset your password.            </p>
          </div>

          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit, (formErrors) =>
              handleFirstError(formErrors, EMAIL_FIELDS, emailForm.setError, emailForm.clearErrors)
            )}
            className="space-y-4"
            noValidate
          >
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={busy}
              leftIcon={<Mail className="w-[18px] h-[18px] text-[#737373]" />}
              error={emailForm.formState.errors.email?.message}
              clearError={() => emailForm.clearErrors("email")}
              {...emailForm.register("email", {
                required: "Email address is required",
                pattern: {
                  value: REGEX.EMAIL,
                  message: "Please enter a valid email address",
                },
              })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSendingOtp}
                disabled={busy}
                className="w-full py-3 h-12 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <span>Send OTP</span>
                {!isSendingOtp && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="mb-6 sm:mb-7">
            <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-[#2d5356] mb-1">
              Verify OTP
            </h1>
            <p className="text-sm text-[#525252]">
              Enter the OTP sent to <span className="font-medium text-[#2d5356]">{email}</span>.
            </p>
          </div>

          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit, (formErrors) =>
              handleFirstError(formErrors, OTP_FIELDS, otpForm.setError, otpForm.clearErrors)
            )}
            className="space-y-4"
            noValidate
          >
            <Input
              label="OTP"
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              autoComplete="one-time-code"
              leftIcon={<KeyRound className="w-[18px] h-[18px] text-[#737373]" />}
              error={otpForm.formState.errors.otp?.message}
              clearError={() => otpForm.clearErrors("otp")}
              onBeforeInput={(e) => {
                if (e.data && !/^[0-9]+$/.test(e.data)) {
                  e.preventDefault()
                }
              }}
              {...otpForm.register("otp", {
                required: "OTP is required",
                minLength: {
                  value: 4,
                  message: "Please enter a valid OTP",
                },
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6)
                },
              })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isVerifyingOtp}
                disabled={isVerifyingOtp}
                className="w-full py-3 h-12 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <span>Verify OTP</span>
                {!isVerifyingOtp && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-[#525252] mt-4">
            Didn&apos;t receive the OTP?{" "}
            {resendIn > 0 ? (
              <span className="font-medium text-[#737373]">
                Resend in {resendIn}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSendingOtp}
                className="font-medium text-[#2d5356] hover:text-[#d09724] hover:underline transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSendingOtp ? "Sending..." : "Resend"}
              </button>
            )}
          </p>
        </>
      )}

      {step === "password" && (
        <>
          <div className="mb-6 sm:mb-7">
            <h1 className="font-sans text-xl sm:text-3xl font-bold tracking-tight text-[#2d5356] mb-1">
              Reset Password
            </h1>
            <p className="text-sm text-[#525252]">
              Create a new password for your Pulse account.
            </p>
          </div>

          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit, (formErrors) =>
              handleFirstError(
                formErrors,
                PASSWORD_FIELDS,
                passwordForm.setError,
                passwordForm.clearErrors
              )
            )}
            className="space-y-4"
            noValidate
          >
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={busy}
              leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
              error={passwordForm.formState.errors.new_password?.message}
              clearError={() => passwordForm.clearErrors("new_password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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
              {...passwordForm.register("new_password", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Re-enter new password"
              autoComplete="new-password"
              disabled={busy}
              leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
              error={passwordForm.formState.errors.confirm_password?.message}
              clearError={() => passwordForm.clearErrors("confirm_password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-[#737373] hover:text-[#000000] p-1 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              }
              {...passwordForm.register("confirm_password", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordForm.getValues("new_password") || "Passwords do not match",
              })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isUpdatingPassword}
                disabled={busy}
                className="w-full py-3 h-12 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <span>Change Password</span>
                {!isUpdatingPassword && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </form>
        </>
      )}

      <p className="text-center text-sm text-[#525252] mt-4">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-medium text-[#2d5356] hover:text-[#d09724] hover:underline transition-colors"
        >
          Log In
        </Link>
      </p>
    </div>
  )
}

export default ForgotPasswordForm
