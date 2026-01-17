'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { apiClient } from '@/lib/api/client'

// --- Interfaces ---
export interface User {
  id: string
  email: string
  name: string
  role: string
  preferences: any
  wallet: { balance: number; currency: string }
  portfolio: any
  kycLevel: 'LEVEL_1' | 'PENDING' | 'LEVEL_2' | 'REJECTED'
  kycData?: {
    documentType: string
    documentUrl?: string
    rejectionReason?: string
    submittedAt?: string
  }
  twoFactorEnabled: boolean
  lastLogin?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
}

interface AuthContextType extends AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CACHE_KEY = 'tsla_user_data'
const CACHE_TS = 'tsla_user_ts'
const CACHE_DURATION = 5 * 60 * 1000 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    initialized: false
  })
  
  const isInitialMount = useRef(true)
  const fetchLock = useRef(false)

  const getCachedUser = useCallback((): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const ts = localStorage.getItem(CACHE_TS)
      if (!cached || !ts) return null
      if (Date.now() - parseInt(ts, 10) > CACHE_DURATION) return null
      return JSON.parse(cached)
    } catch { return null }
  }, [])

  const checkAuth = useCallback(async (force = false) => {
    if (fetchLock.current && !force) return
    fetchLock.current = true

    try {
      const response = await apiClient.getCurrentUser()
      
      if (response.success && response.user) {
        const user = response.user
        localStorage.setItem(CACHE_KEY, JSON.stringify(user))
        localStorage.setItem(CACHE_TS, Date.now().toString())
        setState({ user, loading: false, error: null, initialized: true })
      } else {
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_TS)
        setState({ user: null, loading: false, error: null, initialized: true })
      }
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, initialized: true }))
    } finally {
      fetchLock.current = false
    }
  }, [])

  useEffect(() => {
    if (!isInitialMount.current) return
    isInitialMount.current = false

    const cached = getCachedUser()
    if (cached) {
      setState({ user: cached, loading: false, error: null, initialized: true })
      checkAuth(false)
    } else {
      checkAuth(true)
    }
  }, [checkAuth, getCachedUser])

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }))
    const res = await apiClient.login(email, password)
    
    if (res.success && res.user) {
      const user = res.user
      localStorage.setItem(CACHE_KEY, JSON.stringify(user))
      localStorage.setItem(CACHE_TS, Date.now().toString())
      setState({ user, loading: false, error: null, initialized: true })
      return { success: true, user } // Return user so Login Page can see the role
    }
    
    setState(prev => ({ ...prev, loading: false, error: res.error || 'Login failed' }))
    return { success: false, error: res.error }
  }

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try { 
      await apiClient.logout() 
    } finally {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TS)
      setState({ user: null, loading: false, error: null, initialized: true })
      window.location.href = '/login'
    }
  }

  const contextValue = useMemo(() => ({
    ...state,
    isAuthenticated: !!state.user,
    isAdmin: state.user?.role === 'admin',
    login,
    logout,
    refresh: () => checkAuth(true)
  }), [state, checkAuth])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const useGlobalAuth = useAuth