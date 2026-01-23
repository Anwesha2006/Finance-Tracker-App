'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function LiveFinancialWidget() {
  const { getFinancialSummary } = useFinancial()
  const [summary, setSummary] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Initial load
    updateSummary()
    
    // Update every 5 seconds to show "live" changes
    const interval = setInterval(updateSummary, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const updateSummary = () => {
    setIsAnimating(true)
    const newSummary = getFinancialSummary()
    
    setTimeout(() => {
      setSummary(newSummary)
      setLastUpdate(new Date())
      setIsAnimating(false)
    }, 300)
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="text-blue-500" size={20} />
          <h3 className="font-semibold text-gray-800">Live Financial Status</h3>
        </div>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      {/* Main Balance */}
      <div className={`transition-all duration-300 ${isAnimating ? 'scale-105 opacity-80' : 'scale-100 opacity-100'}`}>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Current Balance</p>
              <p className="text-2xl font-bold text-blue-800">₹{summary.totalBalance.toFixed(2)}</p>
            </div>
            <Wallet className="text-blue-500" size={32} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-sm text-green-600">Income</span>
            </div>
            <p className="text-lg font-bold text-green-800">₹{summary.totalIncome.toFixed(2)}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <TrendingDown className="text-red-500" size={16} />
              <span className="text-sm text-red-600">Expenses</span>
            </div>
            <p className="text-lg font-bold text-red-800">₹{summary.totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        {/* This Month Summary */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600 mb-2">This Month</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="font-semibold text-green-600">₹{summary.thisMonthIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="font-semibold text-red-600">₹{summary.thisMonthExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Savings</p>
              <p className={`font-semibold ${summary.thisMonthSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{summary.thisMonthSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  )
}