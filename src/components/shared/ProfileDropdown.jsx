import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, Loader2 } from 'lucide-react'
import { useLogout } from '../../features/auth/hooks/useAuth'
import { useGetUser } from '../../features/user/hooks/useGetUser'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { mutate: doLogout, isPending } = useLogout()
  const { data: user } = useGetUser()
  const displayName = user?.full_name || user?.email || ''
  const initial = displayName.trim().charAt(0).toUpperCase()

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleProfile = () => {
    setIsOpen(false)
    navigate('/profile')
  }

  const handleLogout = () => {
    setIsOpen(false)
    const protectedPaths = ['/profile', '/quizzes', '/quiz', '/saved']
    if (protectedPaths.some((p) => location.pathname.startsWith(p))) {
      navigate('/dashboard', { replace: true })
    }
    doLogout()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-[#f6f6f6] text-[#2d5356] border border-[#e5e5e5] flex items-center justify-center hover:bg-[#2d5356] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#2d5356] focus:ring-offset-2 cursor-pointer font-medium"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {initial ? (
          <span className="text-sm font-semibold">{initial}</span>
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#e5e5e5] rounded-xl shadow-md py-1.5 z-50 font-sans">

          {/* Profile Button */}
          <button
            type="button"
            onClick={handleProfile}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[16px] text-[#000000] hover:bg-[#f6f6f6] transition-colors text-left cursor-pointer"
          >
            <User className="w-4 h-4 text-[#737373]" />
            <span className="font-medium">Profile</span>
          </button>

          <div className="my-1 border-t border-[#e5e5e5]" />

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[16px] text-[#b42318] hover:bg-[#fee4e2]/40 transition-colors text-left cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#b42318]" />
            ) : (
              <LogOut className="w-4 h-4 text-[#b42318]" />
            )}
            <span className="font-medium">
              {isPending ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
