import { forwardRef, useState, useRef, useEffect, useId, useImperativeHandle } from "react"
import { ChevronDown, Check } from "lucide-react"

export const Select = forwardRef(function Select(
  {
    label,
    optional = false,
    error,
    clearError,
    hint,
    id: customId,
    options = [],
    disabled = false,
    required = false,
    leftIcon,
    size = "default",
    className = "",
    labelClassName = "",
    name,
    value: controlledValue,
    defaultValue = "",
    onChange,
    onBlur,
    placeholder = "Select an option",
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = customId || generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const errorMessage = typeof error === "string" ? error : error?.message
  const hasError = Boolean(errorMessage)

  const [isOpen, setIsOpen] = useState(false)
  const [currentValue, setCurrentValue] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue || ""
  )
  const containerRef = useRef(null)
  const hiddenSelectRef = useRef(null)

  useImperativeHandle(ref, () => hiddenSelectRef.current)

  useEffect(() => {
    if (controlledValue !== undefined) {
      setCurrentValue(controlledValue)
    }
  }, [controlledValue])

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isOpen) {
          setIsOpen(false)
          onBlur?.({ target: { name, value: currentValue } })
        }
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, name, currentValue, onBlur])

  const placeholderOption = options.find((opt) => opt.value === "")
  const effectivePlaceholder =
    placeholder !== "Select an option"
      ? placeholder
      : placeholderOption?.label || placeholder

  const selectableOptions = options.filter(
    (opt) => opt.value !== "" && opt.value !== null && opt.value !== undefined
  )

  const selectedOption = selectableOptions.find(
    (opt) => String(opt.value) === String(currentValue)
  )

  const isPlaceholder = !selectedOption
  const displayLabel = selectedOption ? selectedOption.label : effectivePlaceholder

  const handleSelect = (option) => {
    if (option.disabled || disabled) return
    if (hasError && clearError) {
      clearError()
    }
    setCurrentValue(option.value)
    setIsOpen(false)

    if (hiddenSelectRef.current) {
      hiddenSelectRef.current.value = option.value
      hiddenSelectRef.current.dispatchEvent(new Event("change", { bubbles: true }))
    }

    onChange?.({
      target: {
        name,
        value: option.value,
      },
    })
  }

  const isSm = size === "sm"

  return (
    <div ref={containerRef} className="w-full flex flex-col font-sans relative">
      {/* Hidden native select to maintain 100% form library compatibility */}
      <select
        ref={hiddenSelectRef}
        id={id}
        name={name}
        value={currentValue}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : hint ? hintId : undefined}
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => {
          if (hasError && clearError) {
            clearError()
          }
          setCurrentValue(e.target.value)
          onChange?.(e)
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={`${
            isSm ? "text-xs font-semibold mb-1" : "text-sm font-medium mb-1.5"
          } text-[#000000] flex items-center justify-between ${labelClassName}`}
        >
          <span className="flex items-center gap-1">
            <span>{label}</span>
            {required && (
              <span className="text-[#b42318] text-sm font-normal" aria-hidden="true">
                *
              </span>
            )}
            {optional && (
              <span className="text-[#737373] font-normal text-xs">
                (Optional)
              </span>
            )}
          </span>
        </label>
      )}

      {/* Custom Input Trigger */}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className={`pointer-events-none absolute inset-y-0 ${isSm ? "left-2.5" : "left-3"} flex items-center justify-center text-[#737373] z-10`}>
            {leftIcon}
          </div>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`w-full ${
            isSm ? "h-[40px] text-sm" : "h-[48px] text-sm"
          } text-left bg-white border rounded-[var(--radius-control)] transition-all duration-150 focus:outline-none flex items-center disabled:bg-[#f6f6f6] disabled:text-[#737373] disabled:cursor-not-allowed cursor-pointer ${
            leftIcon ? (isSm ? "pl-[34px]" : "pl-[38px]") : (isSm ? "px-3" : "px-3.5")
          } pr-8 ${
            isOpen
              ? "bg-white border-[#2d5356]"
              : hasError
              ? "border-[#b42318] focus:border-[#b42318]"
              : "border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#2d5356]"
          } ${className}`}
        >
          <span
            className={`truncate ${
              isPlaceholder ? "text-[#737373] font-normal" : "text-[#000000]"
            }`}
          >
            {displayLabel}
          </span>
        </button>

        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#737373] transition-transform duration-200 z-10 ${
            isOpen ? "rotate-180" : ""
          }`}
        />

        {/* Custom Popover Dropdown (opens strictly below input field) */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute top-full mt-1.5 left-0 w-full z-50 bg-white border border-[#e5e5e5] rounded-xl shadow-lg p-1.5 max-h-60 overflow-y-auto"
          >
            {selectableOptions.map((option) => {
              const isSelected = String(option.value) === String(currentValue)
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer select-none ${
                    option.disabled
                      ? "text-[#a1a1aa] cursor-not-allowed opacity-60"
                      : isSelected
                      ? "bg-[#2d5356]/10 text-[#2d5356] font-semibold"
                      : "text-[#262626] hover:bg-[#2d5356]/5 hover:text-[#2d5356]"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#2d5356] ml-2 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {hasError && (
        <p id={errorId} className="text-xs text-[#b42318] font-medium mt-1">
          {errorMessage}
        </p>
      )}

      {!hasError && hint && (
        <p id={hintId} className="text-xs text-[#737373] mt-1">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Select
