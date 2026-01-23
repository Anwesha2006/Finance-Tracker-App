'use client'

import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  History,
  Settings,
  TrendingUp,
  Wallet,
  MessageSquare,
  CirclePoundSterling,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { useState } from 'react'

export default function Sidebar({
  darkMode,
  onToggleDarkMode,
  currentPage,
  onPageChange,
  isCollapsed,
  onToggleCollapse,
}) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handlePageChange = (page) => {
    onPageChange(page)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-accent text-accent-foreground"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-40
          bg-card border-r border-border
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CirclePoundSterling className="w-6 h-6 text-accent" />
            {!isCollapsed && (
              <span className="text-xl font-bold text-accent">
                R4rupee
              </span>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-colors
                  ${active
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'hover:bg-muted'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Theme toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onToggleDarkMode}
            className={`
              w-full flex items-center rounded-lg bg-muted px-3 py-3
              ${isCollapsed ? 'justify-center' : 'justify-between'}
            `}
          >
            {!isCollapsed && <span className="font-medium">Theme</span>}
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </aside>
    </>
  )
}
