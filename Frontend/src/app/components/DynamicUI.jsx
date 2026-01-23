'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { TrendingUp, TrendingDown, Wallet, DollarSign, BarChart3, PieChart } from 'lucide-react'

export default function DynamicUI({ trigger, onUpdate }) {
  const { getFinancialSummary, getExpenseCategories, getIncomeSources } = useFinancial()
  const [animationState, setAnimationState] = useState('idle')
  const [displayData, setDisplayData] = useState(null)
  const [chartType, setChartType] = useState('balance')

  useEffect(() => {
    if (trigger) {
      generateDynamicUI(trigger)
    }
  }, [trigger])

  const generateDynamicUI = async (query) => {
    setAnimationState('loading')
    
    // Simulate processing time for dynamic effect
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const summary = getFinancialSummary()
    const queryLower = query.toLowerCase()
    
    let uiData = {}
    
    if (queryLower.includes('balance') || queryLower.includes('wallet')) {
      uiData = {
        type: 'balance',
        title: 'Wallet Balance',
        value: summary.totalBalance,
        subtitle: `Income: ₹${summary.totalIncome} - Expenses: ₹${summary.totalExpenses}`,
        icon: Wallet,
        color: 'blue',
        chart: [
          { label: 'Income', value: summary.totalIncome, color: '#10b981' },
          { label: 'Expenses', value: summary.totalExpenses, color: '#ef4444' },
          { label: 'Balance', value: summary.totalBalance, color: '#3b82f6' }
        ]
      }
      setChartType('balance')
    } else if (queryLower.includes('expense') || queryLower.includes('spending')) {
      const categories = getExpenseCategories()
      uiData = {
        type: 'expenses',
        title: 'Expense Breakdown',
        value: summary.totalExpenses,
        subtitle: `${categories.length} categories`,
        icon: TrendingDown,
        color: 'red',
        chart: categories.slice(0, 5).map((cat, i) => ({
          label: cat.label,
          value: cat.value,
          color: `hsl(${i * 60}, 70%, 50%)`
        }))
      }
      setChartType('pie')
    } else if (queryLower.includes('income')) {
      const sources = getIncomeSources()
      uiData = {
        type: 'income',
        title: 'Income Sources',
        value: summary.totalIncome,
        subtitle: `${sources.length} sources`,
        icon: TrendingUp,
        color: 'green',
        chart: sources.slice(0, 5).map((source, i) => ({
          label: source.label,
          value: source.value,
          color: `hsl(${120 + i * 30}, 70%, 50%)`
        }))
      }
      setChartType('bar')
    } else {
      // Default overview
      uiData = {
        type: 'overview',
        title: 'Financial Overview',
        value: summary.totalBalance,
        subtitle: 'Complete financial picture',
        icon: BarChart3,
        color: 'purple',
        chart: [
          { label: 'Income', value: summary.totalIncome, color: '#10b981' },
          { label: 'Expenses', value: summary.totalExpenses, color: '#ef4444' },
          { label: 'Savings', value: summary.thisMonthSavings, color: '#8b5cf6' }
        ]
      }
      setChartType('overview')
    }
    
    setDisplayData(uiData)
    setAnimationState('showing')
    
    if (onUpdate) {
      onUpdate(uiData)
    }
  }

  if (!displayData || animationState === 'idle') {
    return null
  }

  const IconComponent = displayData.icon

  return (
    <div className={`dynamic-ui-container transition-all duration-500 ${
      animationState === 'loading' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
    }`}>
      {/* Main Display Card */}
      <div className={`bg-gradient-to-r from-${displayData.color}-500 to-${displayData.color}-600 rounded-lg p-6 text-white mb-4 shadow-lg transform transition-all duration-300 hover:scale-105`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold opacity-90">{displayData.title}</h3>
            <div className="text-3xl font-bold mt-2">₹{displayData.value.toFixed(2)}</div>
            <p className="text-sm opacity-80 mt-1">{displayData.subtitle}</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <IconComponent size={32} />
          </div>
        </div>
      </div>

      {/* Dynamic Chart Visualization */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">Data Visualization</h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setChartType('bar')}
              className={`p-2 rounded ${chartType === 'bar' ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <BarChart3 size={16} />
            </button>
            <button 
              onClick={() => setChartType('pie')}
              className={`p-2 rounded ${chartType === 'pie' ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <PieChart size={16} />
            </button>
          </div>
        </div>

        {chartType === 'bar' && (
          <div className="space-y-3">
            {displayData.chart.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.value / Math.max(...displayData.chart.map(c => c.value))) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm font-medium text-right">₹{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {chartType === 'pie' && (
          <div className="grid grid-cols-2 gap-4">
            {displayData.chart.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">₹{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {chartType === 'balance' && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
              {displayData.chart.map((item, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    ₹{Math.round(item.value / 1000)}K
                  </div>
                  <div className="text-xs mt-2 text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartType === 'overview' && (
          <div className="grid grid-cols-3 gap-4 text-center">
            {displayData.chart.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: item.color }}
                >
                  ₹{item.value.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Update Indicator */}
      {animationState === 'loading' && (
        <div className="flex items-center justify-center mt-4 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-sm">Generating dynamic UI...</span>
        </div>
      )}
    </div>
  )
}