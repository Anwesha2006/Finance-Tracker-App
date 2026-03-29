'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const FinancialContext = createContext()

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider')
  }
  return context
}

export function FinancialProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
const [token, setToken] = useState(null)
  // Load transactions on mount
  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      // In a real app, this would be an API call
      // For now, we'll use the static data
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      } else {
        // Fallback to importing the JSON directly
        const { default: transactionData } = await import('@/data/transactions.json')
        setTransactions(transactionData)
      }
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError(err.message)
      // Fallback to importing the JSON directly
      try {
        const { default: transactionData } = await import('@/data/transactions.json')
        setTransactions(transactionData)
      } catch (fallbackErr) {
        setError('Failed to load transaction data')
      }
    } finally {
      setLoading(false)
    }
  }

  // Calculate financial metrics
  const getFinancialSummary = () => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const income = transactions.filter(t => t.type === 'income')
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
    const netBalance = totalIncome - totalExpenses
    
    // Get current month data
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    
    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const thisMonthSavings = thisMonthIncome - thisMonthExpenses

    return {
      totalBalance: netBalance,
      totalIncome,
      totalExpenses,
      netBalance,
      thisMonthIncome,
      thisMonthExpenses,
      thisMonthSavings,
      transactions: transactions.slice(0, 10), // Recent 10 transactions
    }
  }

  // Get expense categories
  const getExpenseCategories = () => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const categories = {}
    
    expenses.forEach(t => {
      const category = t.name.includes('Bill') ? 'Bills' :
                      t.name.includes('Grocery') || t.name.includes('Food') ? 'Food' :
                      t.name.includes('Restaurant') || t.name.includes('Dining') ? 'Dining' :
                      t.name.includes('Transport') || t.name.includes('Taxi') || t.name.includes('Uber') ? 'Transport' :
                      t.name.includes('Entertainment') || t.name.includes('Movie') ? 'Entertainment' :
                      'Other'
      
      categories[category] = (categories[category] || 0) + Math.abs(t.amount)
    })
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .map(([label, value]) => ({ label, value }))
  }

  // Get income sources
  const getIncomeSources = () => {
    const income = transactions.filter(t => t.type === 'income')
    return income
      .map(t => ({ label: t.name, value: t.amount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  // Ask financial question (connect to API)
  const askFinancialQuestion = async (question) => {
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error asking financial question:', error)
      throw error
    }
  }

  const login = (user, token) => {
  setUser(user);
  setToken(token);

  localStorage.setItem("token", token); // ✅ ADD
  localStorage.setItem("user", JSON.stringify(user)); // ✅ ADD
};

  const signup = (email, password, name) => {
    setUser({ email, name: name || email.split('@')[0], isAuthenticated: true })
  }
useEffect(() => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.log("Error parsing user:", error);
    localStorage.removeItem("user"); // cleanup corrupted data
  }
}, []);
  const value = {
    transactions,
    loading,
    error,
    getFinancialSummary,
    getExpenseCategories,
    getIncomeSources,
    askFinancialQuestion,
    refreshData: loadTransactions,
    user,
    setUser,
    login,
    token,
    signup,
  }

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  )
}