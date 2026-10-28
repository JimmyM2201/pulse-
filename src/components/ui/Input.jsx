import { forwardRef, useId } from "react"

export const Input = forwardRef(function Input(
  {
    label,
    optional = false,
    error,
    clearError,
    hint,
    id: customId,
    type = "text",
    disabled = false,
    required = false,
    leftIcon,
    rightElement,
    size = "default",
    className = "",
    labelClassName = "",
    onChange,
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

  const handleChange = (e) => {
    if (hasError && clearError) {
      clearError()
    }
    onChange?.(e)
  }

  const isSm = size === "sm"

  return (
    <div className="w-full flex flex-col font-sans">
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

      <div className="relative flex items-center">
        {leftIcon && (
          <div className={`pointer-events-none absolute inset-y-0 ${isSm ? "left-2.5" : "left-3"} flex items-center justify-center text-[#737373]`}>
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          onChange={handleChange}
          className={`w-full ${
            isSm ? "h-[40px] py-2 text-sm" : "h-[48px] py-3 text-sm"
          } text-[#000000] bg-white border rounded-[var(--radius-control)] placeholder:text-[#737373] placeholder:font-normal transition-colors duration-150 focus:outline-none disabled:bg-[#f6f6f6] disabled:text-[#737373] disabled:cursor-not-allowed ${
            leftIcon ? (isSm ? "pl-[34px]" : "pl-[38px]") : (isSm ? "px-3" : "px-3.5")
          } ${
            rightElement ? (isSm ? "pr-9" : "pr-10") : (isSm ? "pr-3" : "pr-3.5")
          } ${
            hasError
              ? "border-[#b42318] focus:border-[#b42318]"
              : "border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#2d5356]"
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute inset-y-0 right-3 flex items-center justify-center">
            {rightElement}
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

export default Input
