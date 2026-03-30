'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/app/components/Sidebar'
import { useFinancial } from '@/app/context/FinancialContext'

import Dashboard from '@/app/components/pages/Dashboard'
import Chat from '@/app/components/pages/Chat'
import Expense from '@/app/components/pages/Expense'
import Analytics from '@/app/components/pages/Analytics'
import Wallet from '@/app/components/pages/Wallet'
import Settings from '@/app/components/pages/Settings'
import Landing from '@/app/components/pages/Landing'
import SignIn from '@/app/components/pages/SignIn'
import Onboarding from '@/app/components/pages/Onboarding'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState('landing')
  const { user, logout } = useFinancial()

  useEffect(() => {
    setMounted(true)
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) document.documentElement.classList.add('dark')

    // ?reset=1 in URL clears auth and forces landing (useful for debugging)
    if (window.location.search.includes('reset=1')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.history.replaceState({}, '', '/')
      return // stay on landing
    }

    // Check for valid token — if found go to dashboard, else stay on landing
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length !== 3) throw new Error('bad token')
        const payload = JSON.parse(atob(parts[1]))
        const isExpired = payload.exp * 1000 < Date.now()
        if (isExpired) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        } else {
          setCurrentPage('dashboard')
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    setCurrentPage('landing')
  }

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':    return <Landing onNavigate={setCurrentPage} />
      case 'signIn':     return <SignIn onNavigate={setCurrentPage} />
      case 'onboarding': return <Onboarding onNavigate={setCurrentPage} />
      case 'dashboard':  return <Dashboard />
      case 'chat':       return <Chat />
      case 'expense':    return <Expense />
      case 'analytics':  return <Analytics />
      case 'wallet':     return <Wallet />
      case 'settings':   return <Settings />
      default:           return <Landing onNavigate={setCurrentPage} />
    }
  }

  if (!mounted) {
    // Render landing on server/first paint — avoids blank screen
    return (
      <div className="min-h-screen bg-background">
        <Landing onNavigate={setCurrentPage} />
      </div>
    )
  }

  // Full-screen pages (no sidebar)
  if (['landing', 'signIn', 'onboarding'].includes(currentPage)) {
    return <div className="min-h-screen bg-background">{renderPage()}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
      />
      <main className={`transition-all duration-300 ease-in-out p-4 md:p-8 pt-16 lg:pt-8 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {renderPage()}
      </main>
    </div>
  )
}
