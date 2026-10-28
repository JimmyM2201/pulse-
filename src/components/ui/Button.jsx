import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-[#2d5356] text-white hover:bg-[#223f41] active:bg-[#1a3234] border border-transparent shadow-sm',
  secondary:
    'bg-[#d09724] text-white hover:bg-[#b7831d] active:bg-[#9f7118] border border-transparent shadow-sm',
  outline:
    'bg-white text-[#000000] border border-[#e5e5e5] hover:bg-[#f6f6f6] hover:border-[#cccccc] active:bg-[#eeeeee]',
  outlinePrimary:
    'bg-transparent text-[#2d5356] border border-[#2d5356]/35 hover:border-[#2d5356] hover:bg-[#2d5356]/10 active:bg-[#2d5356]/15',
  ghost:
    'bg-transparent text-[#2d5356] hover:bg-[#2d5356]/10 hover:text-[#1a3234] border border-transparent',
}

const SIZES = {
  sm: 'px-3.5 py-1.5 text-[16px] font-medium gap-1.5 rounded-[var(--radius-control)]',
  md: 'px-4 py-2 text-[16px] font-medium gap-2 rounded-[var(--radius-control)]',
  lg: 'px-5 py-2.5 text-[16px] font-medium gap-2 rounded-[var(--radius-control)]',
}

export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    children,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary
  const sizeClass = SIZES[size] || SIZES.md
  const isDisabled = disabled || isLoading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center font-sans tracking-tight transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d5356] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  )
})
