'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// UPDATED: Import from Context, not the deleted hook
import { useAuth } from '@/context/AuthContext' 
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

// Define routes that should never trigger a redirect/loader
const PUBLIC_ROUTES = ['/', '/login', '/register', '/terms', '/privacy', '/help']

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  // UPDATED: useAuth now provides isAdmin and isAuthenticated from Global State
  const { loading, isAuthenticated, user } = useAuth()
  const isAdmin = user?.role === 'admin'
  
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Wait until initialization is finished
    if (loading) return

    // 2. Skip logic for public routes
    if (PUBLIC_ROUTES.includes(pathname)) return

    // 3. Unauthorized access check
    if (!isAuthenticated) {
      // Use replace to prevent "back button" loops
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    } 

    // 4. Permission check (Admin only)
    if (requireAdmin && !isAdmin) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, isAdmin, pathname, requireAdmin, router])

  const isPublic = PUBLIC_ROUTES.includes(pathname)

  // --- UI RENDERING LOGIC ---

  // Show loader if we are verifying a non-public route
  if (loading && !isPublic) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#050505] transition-colors duration-700">
        <div className="relative group">
          <div className="absolute inset-0 rounded-full border border-gray-100 dark:border-white/5 scale-150 animate-ping opacity-20" />
          <div className="relative h-12 w-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-black dark:text-white animate-spin stroke-[1px] opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Tesla Red Status Dot */}
              <div className="w-1.5 h-1.5 bg-[#E81922] rounded-full animate-pulse shadow-[0_0_15px_rgba(232,25,34,0.5)]" />
            </div>
          </div>
        </div>
        <p className="mt-8 text-[10px] uppercase tracking-[0.5em] font-bold text-gray-400 dark:text-gray-500 animate-pulse">
          Authenticating Node
        </p>
      </div>
    )
  }

  // Prevent "Flash of Protected Content" while redirecting
  if (!isAuthenticated && !isPublic) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505]" />
    )
  }

  return <>{children}</>
}