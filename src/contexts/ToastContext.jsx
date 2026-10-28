import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { isSafeUserMessage } from "../utils/error"

const ToastContext = createContext(null)

const TOAST_CONFIG = {
  error: {
    progressBar: "bg-[#b42318]",
    defaultTitle: "Something went wrong",
  },
  success: {
    progressBar: "bg-[#2d5356]",
    defaultTitle: "Success",
  },
  info: {
    progressBar: "bg-[#2d5356]",
    defaultTitle: "Notice",
  },
}

function ToastItem({ id, message, title, type = "error", onRemove, duration = 4500 }) {
  const [isExiting, setIsExiting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const remainingTimeRef = useRef(duration)

  const config = TOAST_CONFIG[type] || TOAST_CONFIG.error

  // If a specific title is provided, use title + optional subtitle
  // Otherwise, the message itself is displayed directly as the title
  let displayTitle = config.defaultTitle
  let displayMessage = null

  if (title) {
    displayTitle = title
    if (message && message !== title) {
      displayMessage = type === "error" ? (isSafeUserMessage(message) ? message : null) : message
    }
  } else if (message) {
    if (type === "error") {
      displayTitle = isSafeUserMessage(message) ? message : config.defaultTitle
    } else {
      displayTitle = message
    }
  }

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsExiting(true)
    setTimeout(() => onRemove(id), 250)
  }, [id, onRemove])

  // Start initial auto-dismiss timer
  useEffect(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(dismiss, remainingTimeRef.current)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [dismiss])

  // Pause timer and animation on hover
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    const elapsed = Date.now() - startTimeRef.current
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
    setIsPaused(true)
  }

  // Resume timer and animation when cursor leaves
  const handleMouseLeave = () => {
    if (remainingTimeRef.current <= 0) {
      dismiss()
      return
    }
    setIsPaused(false)
    startTimeRef.current = Date.now()
    timerRef.current = setTimeout(dismiss, remainingTimeRef.current)
  }

  return (
    <div
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto w-full bg-white border border-[#e5e5e5] rounded-xl shadow-lg shadow-black/8 overflow-hidden font-sans transition-all duration-300 ${
        isExiting
          ? "opacity-0 translate-y-[-8px] scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-toast-in"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:py-4">
        {/* Content text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#171717] tracking-tight">
            {displayTitle}
          </h4>
          {displayMessage && (
            <p className="text-xs text-[#525252] mt-0.5 leading-relaxed break-words">
              {displayMessage}
            </p>
          )}
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 -mr-1 p-1 text-[#737373] hover:text-[#000000] hover:bg-[#f5f5f5] rounded-md transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle progress bar that pauses on hover */}
      <div className="h-[2.5px] w-full bg-[#f0f0f0]">
        <div
          className={`h-full ${config.progressBar} rounded-full`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        />
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg = null, type = "error", title = null, duration = 4500) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message: msg, title, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    {
      error: (msg = "Something went wrong", title = null, duration) =>
        addToast(msg, "error", title, duration),
      success: (msg = "Success", title = null, duration) =>
        addToast(msg, "success", title, duration),
      info: (msg = "Notice", title = null, duration) =>
        addToast(msg, "info", title, duration),
    },
    [addToast]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast viewport container — top right on all screen sizes */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none w-[calc(100vw-32px)] max-w-[380px]"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            message={t.message}
            title={t.title}
            type={t.type}
            duration={t.duration}
            onRemove={removeToast}
          />
        ))}
      </div>

      <style>{`
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-toast-in {
          animation: toast-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
