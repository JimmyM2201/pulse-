import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { ProfileDropdown } from './ProfileDropdown'

export function Header() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isQuizActive = location.pathname.startsWith('/quiz')
  const isAuthPage =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password')

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 w-full">
          {/* Project name on left corner */}
          <Link
            to="/"
            className="font-serif text-[24px] font-bold tracking-tight text-[#2d5356] hover:opacity-90 transition-opacity"
          >
            PULSE
          </Link>

          {/* Centered Quiz navigation button (hidden on auth pages) */}
          {!isAuthPage && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <Link to="/quizzes">
                <Button
                  variant={isQuizActive ? 'primary' : 'ghost'}
                  size="sm"
                  className={
                    isQuizActive
                      ? 'font-medium'
                      : 'font-medium text-[#2d5356] hover:bg-[#2d5356]/10'
                  }
                >
                  Quiz
                </Button>
              </Link>
            </div>
          )}

          {/* Actions on right */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : !isAuthPage ? (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Link to="/login">
                  <Button
                    variant="outlinePrimary"
                    size="lg"
                    className="h-10 px-4 text-[16px] font-medium rounded-[var(--radius-control)] transition-all"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    className="h-10 px-5 text-[16px] font-medium bg-[#2d5356] text-white hover:bg-[#223f41] active:bg-[#1a3234] rounded-[var(--radius-control)] shadow-sm hover:shadow active:scale-[0.98] transition-all"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
