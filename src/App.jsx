import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './app/providers/QueryProvider'
import AuthProvider from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import AppRoutes from './app/routes'

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
