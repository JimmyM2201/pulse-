import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {
  User,
  BookOpen,
  Phone,
  Save,
  ArrowLeft,
  Loader2,
  GraduationCap,
} from "lucide-react"
import { Input } from "../../../components/ui/Input"
import { Select } from "../../../components/ui/Select"
import { Button } from "../../../components/ui/Button"
import { useGetUser } from "../hooks/useGetUser"
import { useUpdateUser } from "../hooks/useUpdateUser"
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

const PREDEFINED_STANDARDS = [
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
  "Undergraduate",
  "Postgraduate",
]

function parseUserStandard(rawStandard) {
  if (!rawStandard) return { standardVal: "", otherStandardVal: "" }
  const trimmed = String(rawStandard).trim()

  if (PREDEFINED_STANDARDS.includes(trimmed)) {
    return { standardVal: trimmed, otherStandardVal: "" }
  }

  const lower = trimmed.toLowerCase()
  if (lower === "class 9" || lower === "9th" || lower === "9" || lower === "class 9th" || lower === "9th standard") {
    return { standardVal: "9th Standard", otherStandardVal: "" }
  }
  if (lower === "class 10" || lower === "10th" || lower === "10" || lower === "class 10th" || lower === "10th standard") {
    return { standardVal: "10th Standard", otherStandardVal: "" }
  }
  if (lower === "class 11" || lower === "11th" || lower === "11" || lower === "class 11th" || lower === "11th standard") {
    return { standardVal: "11th Standard", otherStandardVal: "" }
  }
  if (lower === "class 12" || lower === "12th" || lower === "12" || lower === "class 12th" || lower === "12th standard") {
    return { standardVal: "12th Standard", otherStandardVal: "" }
  }
  if (lower === "undergraduate" || lower === "college" || lower === "undergrad") {
    return { standardVal: "Undergraduate", otherStandardVal: "" }
  }
  if (lower === "postgraduate" || lower === "postgrad" || lower === "masters" || lower === "master") {
    return { standardVal: "Postgraduate", otherStandardVal: "" }
  }

  return {
    standardVal: "Other",
    otherStandardVal: trimmed === "Other" ? "" : trimmed,
  }
}

const FIELD_ORDER = ["full_name", "standard", "phone"]

export function EditUserForm() {
  const navigate = useNavigate()
  const toast = useToast()

  const { data: user, isLoading: isLoadingUser } = useGetUser()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      full_name: "",
      standard: "",
      other_standard: "",
      phone: "",
    },
  })

  const selectedStandard = watch("standard")

  // Prefill existing user data once fetched
  useEffect(() => {
    if (user) {
      const { standardVal, otherStandardVal } = parseUserStandard(user.standard)

      reset({
        full_name: user.full_name || user.name || "",
        standard: standardVal,
        other_standard: otherStandardVal,
        phone: user.phone || "",
      })
    }
  }, [user, reset])

  const { mutate: doUpdate, isPending: isUpdating } = useUpdateUser({
    onSuccess: (res) => {
      const msg = res?.message || "Profile updated successfully!"
      toast.success(msg)
      navigate("/profile")
    },
    onError: (err) => {
      const message = getErrorMessage(err, "Something went wrong")
      toast.error(message)
    },
  })

  const onSubmit = (formData) => {
    let finalStandard = formData.standard
    if (finalStandard === "Other") {
      finalStandard = formData.other_standard?.trim() || "Other"
    }

    doUpdate({
      full_name: formData.full_name.trim(),
      standard: finalStandard,
      phone: formData.phone ? formData.phone.trim() : null,
    })
  }

  const onInvalid = (formErrors) =>
    handleFirstError(formErrors, FIELD_ORDER, setError, clearErrors)

  if (isLoadingUser) {
    return (
      <div className="w-full max-w-[520px] bg-white border border-[#e5e5e5] rounded-2xl p-8 sm:p-10 shadow-sm font-sans flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d5356] mb-3" />
        <p className="text-sm text-[#737373]">Loading user details...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[520px] bg-white border border-[#e5e5e5] rounded-2xl p-8 sm:p-10 shadow-sm font-sans">
      {/* Header */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#737373] hover:text-[#000000] mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Profile</span>
        </button>
        <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#2d5356] uppercase mb-1">
          ACCOUNT SETTINGS
        </p>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#2d5356] tracking-tight">
          Edit Profile
        </h1>
        <p className="text-sm text-[#525252] mt-2">
          Update your personal details, academic standard, and contact number.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Name"
          required
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={isUpdating}
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

        {/* Standard Select */}
        <Select
          label="Standard"
          placeholder="Select your standard"
          required
          disabled={isUpdating}
          leftIcon={<BookOpen className="w-[18px] h-[18px] text-[#737373]" />}
          options={STANDARD_OPTIONS}
          value={selectedStandard || ""}
          error={errors.standard?.message}
          clearError={() => clearErrors("standard")}
          {...register("standard", {
            required: "Please select your standard",
          })}
        />

        {/* Custom Standard Input when 'Other' is selected */}
        {selectedStandard === "Other" && (
          <Input
            label="Specify Standard"
            placeholder="Enter your standard (e.g. Diploma, PhD, etc.)"
            autoFocus
            disabled={isUpdating}
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

        {/* Phone Number (Optional) */}
        <Input
          label="Phone"
          optional
          type="tel"
          maxLength={10}
          inputMode="numeric"
          placeholder="Enter 10-digit phone number"
          autoComplete="tel"
          disabled={isUpdating}
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

        {/* Action Buttons */}
        <div className="pt-3 flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating}
            className="flex-1 py-3 h-11 text-[16px] font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {!isUpdating && <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={() => navigate("/profile")}
            className="py-3 h-11 text-[16px] font-medium rounded-lg px-5 cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditUserForm
