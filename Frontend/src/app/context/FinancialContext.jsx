'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { transactionAPI } from '../lib/api'

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

  // Helper to smartly categorize raw transaction data
  const smartCategorize = (cat, description) => {
    if (!cat || cat === 'Other') {
      const desc = (description || '').toLowerCase();
      if (desc.match(/uber|lyft|train|bus|flight|transport|taxi|cab|ola|rapido|metro|auto|rickshaw|petrol|fuel|irctc|makemytrip|redbus/)) return 'Transport';
      if (desc.match(/burger|starbucks|pizza|swiggy|zomato|food|dinner|lunch|grocery|barbeque|blinkit|zepto|instamart|bigbasket|kfc|mcdonald|domino|cafe|tea|coffee|chai|restaurant|dining/)) return 'Food';
      if (desc.match(/movie|netflix|netflux|game|fun|spotify|concert|entertainment|prime|disney|hotstar|bookmyshow|youtube/)) return 'Fun';
      if (desc.match(/book|course|school|udemy|college|education|tuition|stationery|library/)) return 'Education';
      if (desc.match(/amazon|flipkart|myntra|shopping|mall|ajio|meesho|zara|clothes|apparel|shoe/)) return 'Other'; 
      if (desc.match(/rent|mortgage|housing|electricity|broadband|wifi|internet|water|bill|jio|airtel|vi/)) return 'Other'; 
    }
    return cat || 'Other';
  };

  // ── Load transactions ────────────────────────────────
  const loadTransactions = useCallback(async () => {
    if (!token) {
      setTransactions([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await transactionAPI.getAll()
      const formatted = data.map(t => ({
        id: t._id,
        name: t.description,
        category: smartCategorize(t.category, t.description),
        amount: t.amount,
        type: t.amount > 0 ? 'income' : 'expense',
        date: new Date(t.createdAt).toISOString().split('T')[0]
      }))
      setTransactions(formatted)
    } catch (err) {
      console.error('Failed to load transactions:', err)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadTransactions() }, [token, loadTransactions])

  // ── Auth helpers ────────────────────────────────────────────────────────────
  const login = (userData, accessToken) => {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    setUser(null)
    setToken(null)
    setTransactions([])
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ── Add a single transaction ────────────────────────────────────────────────
  const addTransaction = async (payload) => {
    try {
      // Create a final amount matching income/expense signs
      const finalAmount = payload.type === 'expense' ? -Math.abs(payload.amount) : Math.abs(payload.amount);
      const res = await transactionAPI.add({
        amount: finalAmount,
        description: payload.name || payload.description || 'Untitled Transaction',
        category: payload.category || 'Other',
      });
      const t = res.transaction || res;
      const newTransaction = {
        id: t._id || Date.now().toString(),
        name: t.description || payload.name,
        category: smartCategorize(t.category || payload.category || 'Other', t.description || payload.name),
        amount: t.amount || finalAmount,
        type: (t.amount || finalAmount) > 0 ? 'income' : 'expense',
        date: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : (payload.date || new Date().toISOString().split('T')[0])
      };
      setTransactions(prev => [newTransaction, ...prev])
      return newTransaction
    } catch (err) {
      console.error('Failed to add transaction:', err)
      throw err;
    }
  }

  // ── Delete a single transaction ─────────────────────────────────────────────
  const removeTransaction = async (id) => {
    try {
      await transactionAPI.remove(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      throw err;
    }
  };

  // ── Financial summary computed from loaded transactions ─────────────────────
  const getFinancialSummary = () => {
    const expenses = transactions.filter(t => t.type === 'expense')

    const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0)
    
    // Fixed total income for the user
    const totalIncome = 20000;
    const totalBalance = totalIncome - totalExpenses;

    const now = new Date()
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    const thisMonthExpenses = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
    const thisMonthIncome = 20000;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netBalance: totalBalance,
      thisMonthIncome,
      thisMonthExpenses,
      thisMonthSavings: thisMonthIncome - thisMonthExpenses,
      transactions: transactions.slice(0, 10),
    }
  }

  const getExpenseCategories = () => {
    // Pre-seed core categories with 0, so they always appear in the Dashboard breakdown!
    const map = {
      'Food': 0,
      'Transport': 0,
      'Fun': 0,
      'Education': 0,
      'Other': 0
    };

    transactions.filter(t => t.type === 'expense').forEach(t => {
      // Aggregate purely by the primary category string.
      let cat = t.category?.name || t.category || 'Other'
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
      removeTransaction,
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
