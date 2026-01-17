'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

/**
 * 2026 SPATIAL THEME TOGGLE
 * Features: Adaptive UI, No-hydration-flicker logic
 */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100/50 dark:bg-white/5 animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Environment Theme"
    >
      {/* Visual Indicator Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-blue-400 fill-blue-400/20 animate-in zoom-in spin-in-45 duration-500" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-in zoom-in spin-in-90 duration-500" />
        )}
      </div>

      {/* 2026 Micro-Border Highlight */}
      <div className="absolute inset-[1px] rounded-full border border-white/5 dark:border-white/10 pointer-events-none" />
    </button>
  )
}