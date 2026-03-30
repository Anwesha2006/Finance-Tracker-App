'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, transactionAPI } from '../lib/api'

const FinancialContext = createContext()

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (!context) throw new Error('useFinancial must be used within a FinancialProvider')
  return context
}

export function FinancialProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // ── Restore session from localStorage ──────────────────────────────────────
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch {
      localStorage.removeItem('user')
    }
  }, [])

  // ── Load transactions whenever token changes ────────────────────────────────
  const loadTransactions = useCallback(async () => {
    const t = localStorage.getItem('token')
    if (!t) {
      // No auth — load static demo data silently
      try {
        const { default: demo } = await import('@/data/transactions.json')
        setTransactions(demo)
      } catch { setTransactions([]) }
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await transactionAPI.getAll()
      setTransactions(data.data?.transactions || [])
    } catch {
      // Backend unreachable — silently fall back to demo data, don't crash
      try {
        const { default: demo } = await import('@/data/transactions.json')
        setTransactions(demo)
      } catch { setTransactions([]) }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTransactions() }, [token, loadTransactions])

  // ── Auth helpers ────────────────────────────────────────────────────────────
  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try { await authAPI.logout() } catch { /* ignore */ }
    setUser(null)
    setToken(null)
    setTransactions([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ── Add a single transaction ────────────────────────────────────────────────
  const addTransaction = async (payload) => {
    const data = await transactionAPI.add(payload)
    // Prepend to local list so UI updates instantly
    setTransactions(prev => [data.data, ...prev])
    return data.data
  }

  // ── Financial summary computed from loaded transactions ─────────────────────
  const getFinancialSummary = () => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const income   = transactions.filter(t => t.type === 'income')

    const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0)
    const totalIncome   = income.reduce((s, t) => s + t.amount, 0)

    const now = new Date()
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const thisMonthExpenses = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
    const thisMonthIncome   = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      thisMonthIncome,
      thisMonthExpenses,
      thisMonthSavings: thisMonthIncome - thisMonthExpenses,
      transactions: transactions.slice(0, 10),
    }
  }

  const getExpenseCategories = () => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category?.name || t.category || 'Other'
      map[cat] = (map[cat] || 0) + Math.abs(t.amount)
    })
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value }))
  }

  const getIncomeSources = () =>
    transactions
      .filter(t => t.type === 'income')
      .map(t => ({ label: t.name, value: t.amount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

  // ── AI chat ─────────────────────────────────────────────────────────────────
  const askFinancialQuestion = async (question) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  }

  return (
    <FinancialContext.Provider value={{
      transactions,
      loading,
      error,
      user,
      token,
      login,
      logout,
      addTransaction,
      getFinancialSummary,
      getExpenseCategories,
      getIncomeSources,
      askFinancialQuestion,
      refreshData: loadTransactions,
      // legacy compat
      setUser,
      signup: login,
    }}>
      {children}
    </FinancialContext.Provider>
  )
}
