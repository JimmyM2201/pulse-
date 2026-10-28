import { Calendar } from 'lucide-react'

export function formatDate(date, options = {}) {
  if (!date) return null
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    })
  } catch {
    return null
  }
}

export function DateDisplay({
  date,
  showIcon = false,
  icon: Icon = Calendar,
  iconClassName = 'w-3.5 h-3.5',
  className = 'text-xs text-[#737373]',
  fallback = null,
  options,
}) {
  const formatted = formatDate(date, options)

  if (!formatted) {
    if (!fallback) return null
    return <span className={className}>{fallback}</span>
  }

  if (showIcon && Icon) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <Icon className={iconClassName} />
        <span>{formatted}</span>
      </span>
    )
  }

  return <span className={className}>{formatted}</span>
}

export const FormattedDate = DateDisplay
