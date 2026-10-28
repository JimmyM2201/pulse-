import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  User,
  Mail,
  BookOpen,
  Phone,
  GraduationCap,
  Pencil,
  Check,
  Loader2,
  Bookmark,
  Heart,
} from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { useGetUser } from '../hooks/useGetUser'
import { useUpdateUser } from '../hooks/useUpdateUser'
import { ChangePasswordCard } from '../components/ChangePasswordCard'
import { useSavedArticles } from '../../dashboard/hooks/useSavedArticles'
import { useArticles } from '../../dashboard/hooks/useArticles'
import { ArticleCard } from '../../dashboard/components/ArticleCard'
import { ArticleSkeleton } from '../../dashboard/components/ArticleSkeleton'
import { REGEX } from '../../../constants/regex'
import { handleFirstError } from '../../../utils/form'
import { getErrorMessage } from '../../../utils/error'
import { useToast } from '../../../contexts/ToastContext'

const TABS = [
  { id: 'personal', label: 'Personal' },
  { id: 'liked', label: 'Liked' },
  { id: 'saved', label: 'Saved' },
]

const STANDARD_OPTIONS = [
  { value: '9th Standard', label: '9th' },
  { value: '10th Standard', label: '10th' },
  { value: '11th Standard', label: '11th' },
  { value: '12th Standard', label: '12th' },
  { value: 'Undergraduate', label: 'Undergraduate / College' },
  { value: 'Postgraduate', label: 'Postgraduate' },
  { value: 'Other', label: 'Other' },
]

const PREDEFINED_STANDARDS = [
  '9th Standard',
  '10th Standard',
  '11th Standard',
  '12th Standard',
  'Undergraduate',
  'Postgraduate',
]

function parseUserStandard(rawStandard) {
  if (!rawStandard) return { standardVal: '', otherStandardVal: '' }
  const trimmed = String(rawStandard).trim()

  if (PREDEFINED_STANDARDS.includes(trimmed)) {
    return { standardVal: trimmed, otherStandardVal: '' }
  }

  const lower = trimmed.toLowerCase()
  if (lower === 'class 9' || lower === '9th' || lower === '9' || lower === 'class 9th' || lower === '9th standard') {
    return { standardVal: '9th Standard', otherStandardVal: '' }
  }
  if (lower === 'class 10' || lower === '10th' || lower === '10' || lower === 'class 10th' || lower === '10th standard') {
    return { standardVal: '10th Standard', otherStandardVal: '' }
  }
  if (lower === 'class 11' || lower === '11th' || lower === '11' || lower === 'class 11th' || lower === '11th standard') {
    return { standardVal: '11th Standard', otherStandardVal: '' }
  }
  if (lower === 'class 12' || lower === '12th' || lower === '12' || lower === 'class 12th' || lower === '12th standard') {
    return { standardVal: '12th Standard', otherStandardVal: '' }
  }
  if (lower === 'undergraduate' || lower === 'college' || lower === 'undergrad') {
    return { standardVal: 'Undergraduate', otherStandardVal: '' }
  }
  if (lower === 'postgraduate' || lower === 'postgrad' || lower === 'masters' || lower === 'master') {
    return { standardVal: 'Postgraduate', otherStandardVal: '' }
  }

  return {
    standardVal: 'Other',
    otherStandardVal: trimmed === 'Other' ? '' : trimmed,
  }
}

const FIELD_ORDER = ['full_name', 'standard', 'phone']

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const currentTab = TABS.some((t) => t.id === rawTab) ? rawTab : 'personal'

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId }, { replace: true })
  }

  const [isEditing, setIsEditing] = useState(false)
  const toast = useToast()

  const { data: user, isLoading: isLoadingUser } = useGetUser()
  const displayName = user?.full_name || user?.name || ''
  const initial = (displayName || user?.email || '').trim().charAt(0).toUpperCase()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      full_name: '',
      standard: '',
      other_standard: '',
      phone: '',
    },
  })

  const selectedStandard = watch('standard')

  const resetFormToUser = () => {
    clearErrors()
    const { standardVal, otherStandardVal } = parseUserStandard(user?.standard)
    reset({
      full_name: user?.full_name || user?.name || '',
      standard: standardVal,
      other_standard: otherStandardVal,
      phone: user?.phone || '',
    })
  }

  // Prefill existing user data once fetched
  useEffect(() => {
    if (user) {
      resetFormToUser()
    }
  }, [user])

  const handleStartEdit = () => {
    resetFormToUser()
    setIsEditing(true)
  }

  const { mutate: doUpdate, isPending: isUpdating } = useUpdateUser({
    onSuccess: (res) => {
      const msg = res?.message || 'Profile updated successfully!'
      toast.success(msg)
      setIsEditing(false)
    },
    onError: (err) => {
      const message = getErrorMessage(err, 'Something went wrong')
      toast.error(message)
    },
  })

  const onSubmit = (formData) => {
    let finalStandard = formData.standard
    if (finalStandard === 'Other') {
      finalStandard = formData.other_standard?.trim() || 'Other'
    }

    doUpdate({
      full_name: formData.full_name.trim(),
      standard: finalStandard,
      phone: formData.phone ? formData.phone.trim() : null,
    })
  }

  const onInvalid = (formErrors) =>
    handleFirstError(formErrors, FIELD_ORDER, setError, clearErrors)

  const handleCancel = () => {
    resetFormToUser()
    setIsEditing(false)
  }

  return (
    <div className="w-full mx-auto font-sans -mt-4 sm:-mt-6 md:-mt-8 pb-6">
      {/* Top Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-7 sm:mb-8 flex items-center gap-1.5 text-xs sm:text-sm text-[#737373]">
        <Link to="/dashboard" className="hover:text-[#000000] transition-colors">
          Home
        </Link>
        <span className="text-[#8e8e93]">›</span>
        <span className="text-[#737373]">Profile</span>
      </nav>

      {/* User Info Header matching 2nd image */}
      <div className="flex items-center gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-[#e5e5e5]">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#dbe5e1] text-[#2d5356] flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
          {initial ? initial : <User className="w-6 h-6" />}
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[#171717] leading-tight truncate">
            {displayName || 'User'}
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] mt-0.5 truncate">
            {user?.email || ''}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-[#e5e5e5] mt-3 sm:mt-4 mb-5 sm:mb-6 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-4 sm:px-6 py-2.5 sm:py-3 text-[16px] font-medium transition-all duration-150 rounded-t-lg cursor-pointer whitespace-nowrap select-none ${
                isActive
                  ? 'text-[#2d5356] font-semibold'
                  : 'text-[#525252] hover:text-[#000000] hover:bg-[#f5f5f5]'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#2d5356] rounded-t-sm" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {currentTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div className="bg-white border border-[#e5e5e5] rounded-2xl p-5 sm:p-7 lg:p-8 transition-all duration-200 h-full flex flex-col justify-between">
          {isLoadingUser ? (
            <div className="flex flex-col items-center justify-center min-h-[220px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#2d5356] mb-3" />
              <p className="text-sm text-[#737373]">Loading personal details...</p>
            </div>
          ) : (
            <>
              {/* Header with Title and Edit Button */}
              <div className="flex items-start justify-between pb-5 border-b border-[#f0f0f0]">
                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#2d5356]">
                    Personal Information
                </h2>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#edf2f0] hover:bg-[#e2ebe7] text-[#2d5356] text-[16px] font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {/* View Mode: Single-line horizontal rows */}
              {!isEditing ? (
                <div className="pt-5 sm:pt-6 flex-1 flex flex-col justify-between divide-y divide-[#f0f0f0]">
                  {/* Row 1: Full Name */}
                  <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#f8faf9] flex items-center justify-center shrink-0 text-[#2d5356]">
                        <User className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-[#737373]">
                        Full Name
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[#171717] truncate text-right">
                      {user?.full_name || user?.name || '-'}
                    </span>
                  </div>

                  {/* Row 2: Email Address */}
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#f8faf9] flex items-center justify-center shrink-0 text-[#2d5356]">
                        <Mail className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-[#737373]">
                        Email Address
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[#171717] truncate text-right">
                      {user?.email || '-'}
                    </span>
                  </div>

                  {/* Row 3: Standard */}
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#f8faf9] flex items-center justify-center shrink-0 text-[#2d5356]">
                        <GraduationCap className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-[#737373]">
                        Standard
                      </span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[#171717] truncate text-right">
                      {user?.standard || '-'}
                    </span>
                  </div>

                  {/* Row 4: Phone Number */}
                  <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#f8faf9] flex items-center justify-center shrink-0 text-[#2d5356]">
                        <Phone className="w-[18px] h-[18px]" />
                      </div>
                      <span className="text-xs sm:text-sm font-normal text-[#737373]">
                        Phone Number
                      </span>
                    </div>
                    <span
                      className={`text-sm sm:text-base ${
                        user?.phone ? 'font-semibold text-[#171717]' : 'font-normal text-[#737373]'
                      } truncate text-right`}
                    >
                      {user?.phone || 'Not added'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Inline Edit Form */
                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex-1 flex flex-col justify-between pt-5 sm:pt-6" noValidate>
                  <div className="space-y-4 sm:space-y-5">
                    {/* Full Name */}
                    <div className="w-full">
                      <Input
                        label="Full Name"
                        required
                        placeholder="Enter your full name"
                        autoComplete="name"
                        disabled={isUpdating}
                        leftIcon={<User className="w-[18px] h-[18px] text-[#737373]" />}
                        error={errors.full_name?.message}
                        clearError={() => clearErrors('full_name')}
                        onBeforeInput={(e) => {
                          if (e.data && !/^[a-zA-Z0-9 ]+$/.test(e.data)) {
                            e.preventDefault()
                          }
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                        }}
                        {...register('full_name', {
                          required: 'Full name is required',
                          minLength: {
                            value: 2,
                            message: 'Full name must be at least 2 characters',
                          },
                          pattern: {
                            value: REGEX.ALPHANUMERIC_SPACE,
                            message: 'Only letters, numbers, and spaces are allowed',
                          },
                          validate: (value) => {
                            if (!value || !value.trim()) {
                              return 'Full name cannot be empty or spaces only'
                            }
                            if (value.trim().length < 2) {
                              return 'Full name must be at least 2 characters'
                            }
                            return true
                          },
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                          },
                        })}
                      />
                    </div>

                    {/* Standard Select */}
                    <div className="w-full">
                      <Select
                        label="Standard"
                        placeholder="Select your standard"
                        required
                        disabled={isUpdating}
                        leftIcon={<BookOpen className="w-[18px] h-[18px] text-[#737373]" />}
                        options={STANDARD_OPTIONS}
                        value={selectedStandard || ''}
                        error={errors.standard?.message}
                        clearError={() => clearErrors('standard')}
                        {...register('standard', {
                          required: 'Please select your standard',
                        })}
                      />
                    </div>

                    {/* Custom Standard Input when 'Other' is selected */}
                    {selectedStandard === 'Other' && (
                      <div className="w-full">
                        <Input
                          label="Specify Standard"
                          placeholder="Enter your standard (e.g. Diploma, PhD, etc.)"
                          autoFocus
                          disabled={isUpdating}
                          leftIcon={<GraduationCap className="w-[18px] h-[18px] text-[#737373]" />}
                          error={errors.other_standard?.message}
                          clearError={() => clearErrors('other_standard')}
                          onBeforeInput={(e) => {
                            if (e.data && !/^[a-zA-Z0-9 ]+$/.test(e.data)) {
                              e.preventDefault()
                            }
                          }}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                          }}
                          {...register('other_standard', {
                            pattern: {
                              value: REGEX.NO_SPECIAL_CHAR,
                              message: 'Special characters are not allowed',
                            },
                            onChange: (e) => {
                              e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                            },
                          })}
                        />
                      </div>
                    )}

                    {/* Phone Number */}
                    <div className="w-full">
                      <Input
                        label="Phone Number"
                        optional
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="Enter 10-digit phone number"
                        autoComplete="tel"
                        disabled={isUpdating}
                        leftIcon={<Phone className="w-[18px] h-[18px] text-[#737373]" />}
                        error={errors.phone?.message}
                        clearError={() => clearErrors('phone')}
                        onBeforeInput={(e) => {
                          if (e.data && !/^[0-9]+$/.test(e.data)) {
                            e.preventDefault()
                          }
                        }}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)
                        }}
                        {...register('phone', {
                          validate: (val) => {
                            if (!val) return true
                            if (!REGEX.PHONE.test(val)) {
                              return 'Phone number must be exactly 10 digits'
                            }
                            return true
                          },
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          },
                        })}
                      />
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-3 mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUpdating}
                      onClick={handleCancel}
                      className="px-5 py-2.5 text-[16px] cursor-pointer"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isUpdating}
                      className="bg-[#1c3b3d] hover:bg-[#223f41] text-white px-6 py-2.5 rounded-lg text-[16px] font-medium flex items-center gap-2 cursor-pointer"
                    >
                      {!isUpdating && <Check className="w-4 h-4" />}
                      <span>Save Changes</span>
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Change Password Card */}
        <ChangePasswordCard />
      </div>
    )}

      {/* Tab 2: Liked Articles */}
      {currentTab === 'liked' && <LikedTabContent />}

      {/* Tab 3: Saved Articles */}
      {currentTab === 'saved' && <SavedTabContent />}
    </div>
  )
}

function LikedTabContent() {
  const { data: articles, isLoading, isError, error, refetch } = useArticles()
  const likedArticles =
    articles?.filter((a) =>
      Boolean(a.is_liked ?? a.isLiked ?? a.user_liked ?? a.has_liked)
    ) || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load liked articles"
        message={error?.message || 'We had trouble loading your liked articles. Please try again.'}
        onRetry={() => refetch()}
      />
    )
  }

  if (likedArticles.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No liked articles yet"
        description="Articles you like while reading will appear here."
        action={
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Explore Articles
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {likedArticles.map((article) => (
        <ArticleCard key={article.id || article._id} article={article} />
      ))}
    </div>
  )
}

function SavedTabContent() {
  const { data: articles, isLoading, isError, error, refetch } = useSavedArticles()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load saved articles"
        message={error?.message || 'We had trouble fetching your saved reading list. Please try again.'}
        onRetry={() => refetch()}
      />
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved articles yet"
        description="You haven't bookmarked any articles yet. Explore stories and save your favorites to read anytime."
        action={
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Explore Articles
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id || article._id} article={article} />
      ))}
    </div>
  )
}

export default ProfilePage
