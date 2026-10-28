/**
 * Reusable editorial Skeleton loading primitive.
 * Subtle, restrained pulse using theme light-grey and border tokens.
 */
export function Skeleton({
  className = '',
  variant = 'default', // 'default', 'card', 'circle', 'text'
  ...props
}) {
  const variantStyles = {
    default: 'rounded-[var(--radius-control)]',
    card: 'rounded-[var(--radius-card)]',
    circle: 'rounded-full',
    text: 'rounded h-4 my-1',
  }

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[#f6f6f6] border border-[#e5e5e5] ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    />
  )
}
