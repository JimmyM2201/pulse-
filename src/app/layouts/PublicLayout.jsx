import { Outlet } from 'react-router-dom'
import { Header } from '../../components/shared/Header'

/**
 * PublicLayout establishes the shared page shell for Pulse.
 * Consistently applies Header and standard content area with the new palette.
 */
export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#000000] font-sans antialiased">
      <Header />
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
