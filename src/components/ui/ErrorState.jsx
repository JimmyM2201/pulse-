import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from './Button'

/**
 * Editorial ErrorState primitive.
 * Displays retryable, user-friendly error feedback without leaking internal details.
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content.',
  onRetry,
  retryLabel = 'Try again',
  action,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-10 border border-[#e5e5e5] rounded-[var(--radius-card)] bg-white ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#b42318]/10 flex items-center justify-center text-[#b42318] mb-4">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-[#000000] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[#525252] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {action && <div className="flex items-center gap-3 mb-2">{action}</div>}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  )
}
