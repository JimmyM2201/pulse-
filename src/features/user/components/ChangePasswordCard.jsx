import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useChangePassword } from '../hooks/useChangePassword'
import { useToast } from '../../../contexts/ToastContext'
import { getErrorMessage } from '../../../utils/error'
import { handleFirstError } from '../../../utils/form'

const FIELD_ORDER = ['old_password', 'new_password', 'confirm_password']

export function ChangePasswordCard() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const toast = useToast()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  const { mutate: doChangePassword, isPending } = useChangePassword({
    onSuccess: (res) => {
      const msg = res?.message || 'Password changed successfully!'
      toast.success(msg)
      reset()
      setShowOldPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    },
    onError: (err) => {
      const message = getErrorMessage(
        err,
        'Failed to change password. Please verify your current password.'
      )
      toast.error(message)
    },
  })

  const onSubmit = (formData) => {
    doChangePassword({
      old_password: formData.old_password,
      new_password: formData.new_password,
    })
  }

  const onInvalid = (formErrors) => {
    handleFirstError(formErrors, FIELD_ORDER, setError, clearErrors)
  }

  const handleCancel = () => {
    clearErrors()
    reset()
    setShowOldPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const hasEnteredValues = Boolean(
    watch('old_password') || watch('new_password') || watch('confirm_password')
  )

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7 lg:p-8 transition-all duration-200 font-sans h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between pb-5 border-b border-[#f0f0f0]">
        <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#2d5356]">
            Change Password
        </h2>

        <div className="w-9 h-9 rounded-full bg-[#f0f4f2] text-[#2d5356] flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex-1 flex flex-col justify-between pt-5 sm:pt-6" noValidate>
        <div className="space-y-4 sm:space-y-5">
          {/* Current Password */}
        <div className="w-full">
          <Input
            label="Current Password"
            type={showOldPassword ? 'text' : 'password'}
            required
            placeholder="Enter current password"
            autoComplete="current-password"
            disabled={isPending}
            leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
            error={errors.old_password?.message}
            clearError={() => clearErrors('old_password')}
            rightElement={
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="text-[#737373] hover:text-[#000000] p-1 transition-colors focus:outline-none cursor-pointer"
                aria-label={showOldPassword ? 'Hide current password' : 'Show current password'}
                tabIndex={-1}
              >
                {showOldPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            }
            {...register('old_password', {
              required: 'Current password is required',
            })}
          />
        </div>

        {/* New Password */}
        <div className="w-full">
          <Input
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            required
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={isPending}
            leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
            error={errors.new_password?.message}
            clearError={() => clearErrors('new_password')}
            rightElement={
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-[#737373] hover:text-[#000000] p-1 transition-colors focus:outline-none cursor-pointer"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            }
            {...register('new_password', {
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              validate: (val) => {
                if (val && val === watch('old_password')) {
                  return 'New password must be different from current password'
                }
                return true
              },
            })}
          />
        </div>

        {/* Confirm New Password */}
        <div className="w-full">
          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="Re-enter new password"
            autoComplete="new-password"
            disabled={isPending}
            leftIcon={<Lock className="w-[18px] h-[18px] text-[#737373]" />}
            error={errors.confirm_password?.message}
            clearError={() => clearErrors('confirm_password')}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-[#737373] hover:text-[#000000] p-1 transition-colors focus:outline-none cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" />
                ) : (
                  <Eye className="w-[18px] h-[18px]" />
                )}
              </button>
            }
            {...register('confirm_password', {
              required: 'Please confirm your new password',
              validate: (val) => {
                if (val !== watch('new_password')) {
                  return 'Passwords do not match'
                }
                return true
              },
            })}
          />
        </div>
      </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 mt-auto">
          {(isDirty || hasEnteredValues) && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleCancel}
              className="px-5 py-2.5 text-[16px] font-medium text-[#525252] hover:text-[#000000] hover:bg-[#f5f5f5] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="bg-[#1c3b3d] hover:bg-[#223f41] text-white px-6 py-2.5 rounded-lg text-[16px] font-medium flex items-center gap-2 cursor-pointer"
          >
            {!isPending && <ShieldCheck className="w-4 h-4" />}
            <span>Update Password</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordCard
