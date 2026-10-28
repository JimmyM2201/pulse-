import { Inbox } from 'lucide-react'

/**
 * Editorial EmptyState primitive.
 * Displays a clean, quiet state when a list or query returns no items.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = 'No content available',
  description = 'There are no items to display at this time.',
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-[#e5e5e5] rounded-[var(--radius-card)] bg-white ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#f6f6f6] flex items-center justify-center text-[#2d5356] mb-4">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#000000] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#525252] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}
