import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { SignUpPage } from '../features/auth/pages/SignUpPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ArticleDetailPage } from '../features/dashboard/pages/ArticleDetailPage'
import { EditUserPage } from '../features/user/pages/EditUserPage'
import { ProfilePage } from '../features/user/pages/ProfilePage'
import { QuizzesPage } from '../features/quiz/pages/QuizzesPage'
import { QuizPlayPage } from '../features/quiz/pages/QuizPlayPage'
import { SavedArticlesPage } from '../features/dashboard/pages/SavedArticlesPage'
import { useAuth } from '../contexts/AuthContext'

function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

function PublicRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (isAuthenticated) {
    return <Navigate to={location.state?.from || '/dashboard'} replace />
  }
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {/* Public browse routes accessible without login */}
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="articles/:articleId" element={<ArticleDetailPage />} />

        {/* Public auth routes only for unauthenticated users */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="register" element={<SignUpPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>

        {/* Protected routes that require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="saved" element={<Navigate to="/profile?tab=saved" replace />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="quizzes/:quizId" element={<QuizPlayPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<Navigate to="/profile" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
