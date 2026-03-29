'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/app/components/Sidebar'

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
const[currentPage, setCurrentPage] = useState('landing')
  useEffect(() => {
    setMounted(true)

    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches

    setDarkMode(isDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('darkMode', String(next))

    document.documentElement.classList.toggle('dark', next)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': 
        return <Landing />
      case 'dashboard':
        return <Dashboard />
      case 'chat':
        return <Chat />
      case 'expense':
        return <Expense />
      case 'analytics':
        return <Analytics />
      case 'wallet':
        return <Wallet />
      case 'settings':
        return <Settings />
      default:
        return <Landing />
    }
  }

  if (!mounted) return null

  if (currentPage === 'landing') {
    return <Landing onNavigate={setCurrentPage} />
  }
  
  if (currentPage === 'signIn') {
    return <SignIn onNavigate={setCurrentPage} />
  }
  
  if (currentPage === 'onboarding') {
    return <Onboarding onNavigate={setCurrentPage} />
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
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          p-4 md:p-8 pt-16 lg:pt-8
          ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
      >
        {renderPage()}
      </main>
    </div>
  )
}
