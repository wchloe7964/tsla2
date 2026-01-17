'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function AdminRootPage() {
  const { user, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (initialized) {
      if (user?.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        // If they aren't an admin, send them to the main site
        router.replace('/')
      }
    }
  }, [user, initialized, router])

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <Loader2 className="animate-spin text-emerald-500" />
    </div>
  )
}