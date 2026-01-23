'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function EnhancedChatUI({ question, onResponse }) {
  const { getFinancialSummary, askFinancialQuestion } = useFinancial()
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [uiComponents, setUiComponents] = useState([])
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (question) {
      generateEnhancedUI(question)
    }
  }, [question])

  const generateEnhancedUI = async (userQuestion) => {
    setIsLoading(true)
    setResponse(null)
    setUiComponents([])
    setAnimationPhase(0)

    try {
      // Get financial data
      const summary = getFinancialSummary()
      const apiResponse = await askFinancialQuestion(userQuestion)
      
      setResponse(apiResponse)
      
      // Generate enhanced UI components
      const components = createEnhancedComponents(userQuestion, apiResponse, summary)
      setUiComponents(components)
      
      // Trigger animation phases
      setTimeout(() => setAnimationPhase(1), 200)
      setTimeout(() => setAnimationPhase(2), 600)
      setTimeout(() => setAnimationPhase(3), 1000)
      
      if (onResponse) {
        onResponse(apiResponse)
      }
    } catch (error) {
      console.error('Error generating enhanced UI:', error)
      setUiComponents([{
        type: 'error',
        message: 'Unable to generate enhanced UI for this query'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const createEnhancedComponents = (question, apiResponse, summary) => {
    const questionLower = question.toLowerCase()
    const components = []

    // Add enhanced response header
    components.push({
      type: 'response-header',
      text: apiResponse.insight,
      phase: 1
    })

    // Add specific enhanced UI based on question type
    if (questionLower.includes('balance') || questionLower.includes('wallet')) {
      components.push({
        type: 'balance-dashboard',
        balance: summary.totalBalance,
        income: summary.totalIncome,
        expenses: summary.totalExpenses,
        trend: summary.totalBalance > 10000 ? 'positive' : 'neutral',
        phase: 2
      })
      
      // Add balance trend chart
      components.push({
        type: 'balance-chart',
        data: [
          { name: 'Income', value: summary.totalIncome, color: '#10b981' },
          { name: 'Expenses', value: summary.totalExpenses, color: '#ef4444' },
          { name: 'Balance', value: summary.totalBalance, color: '#3b82f6' }
        ],
        phase: 3
      })
    }

    if (questionLower.includes('expense') && apiResponse.data) {
      components.push({
        type: 'expense-analytics',
        data: apiResponse.data,
        total: summary.totalExpenses,
        phase: 2
      })
      
      // Add expense bar chart
      components.push({
        type: 'expense-bar-chart',
        data: apiResponse.data.map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length]
        })),
        phase: 3
      })
      
      // Add expense pie chart
      components.push({
        type: 'expense-pie-chart',
        data: apiResponse.data.slice(0, 5),
        phase: 3
      })
    }

    if (questionLower.includes('income') && apiResponse.data) {
      components.push({
        type: 'income-analytics',
        data: apiResponse.data,
        total: summary.totalIncome,
        phase: 2
      })
      
      // Add income bar chart
      components.push({
        type: 'income-bar-chart',
        data: apiResponse.data.map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length]
        })),
        phase: 3
      })
    }

    // Add AI insights panel
    components.push({
      type: 'ai-insights',
      insights: generateAdvancedInsights(summary, questionLower),
      recommendations: generateSmartRecommendations(summary, questionLower),
      phase: 3
    })

    return components
  }

  const generateAdvancedInsights = (summary, questionType) => {
    const insights = []
    const expenseRatio = summary.totalExpenses / summary.totalIncome
    const savingsRate = ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1)
    
    if (questionType.includes('balance')) {
      insights.push(`Your savings rate is ${savingsRate}%, which is ${savingsRate > 20 ? 'excellent' : savingsRate > 10 ? 'good' : 'needs improvement'}`)
      insights.push(`You're spending ${(expenseRatio * 100).toFixed(1)}% of your income`)
    }
    
    if (questionType.includes('expense')) {
      insights.push(`Your expense-to-income ratio is ${(expenseRatio * 100).toFixed(1)}%`)
      insights.push(`Monthly expenses average ₹${(summary.totalExpenses / 12).toFixed(0)}`)
    }
    
    if (questionType.includes('income')) {
      insights.push(`Your income streams show ${summary.totalIncome > 15000 ? 'strong' : 'moderate'} financial stability`)
      insights.push(`Monthly income average ₹${(summary.totalIncome / 12).toFixed(0)}`)
    }
    
    return insights
  }

  const generateSmartRecommendations = (summary, questionType) => {
    const recommendations = []
    const expenseRatio = summary.totalExpenses / summary.totalIncome
    
    if (expenseRatio < 0.5) {
      recommendations.push('💡 Consider investing your surplus in mutual funds or SIPs')
      recommendations.push('🎯 You could increase your emergency fund to 6 months of expenses')
    } else if (expenseRatio > 0.8) {
      recommendations.push('⚠️ Consider reducing discretionary spending')
      recommendations.push('📊 Review your expense categories for optimization opportunities')
    }
    
    if (summary.totalBalance > 20000) {
      recommendations.push('💰 Consider diversifying into different investment options')
    }
    
    if (questionType.includes('income')) {
      recommendations.push('📈 Explore additional income streams for better financial security')
    }
    
    return recommendations
  }

  const renderComponent = (component, index) => {
    const isVisible = animationPhase >= component.phase
    const baseClasses = `transform transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`

    switch (component.type) {
      case 'response-header':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="flex items-start gap-4">
                <div className="bg-white bg-opacity-10 p-3 rounded-full border border-gray-600">
                  <Activity size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">🤖 AI Financial Analysis</h3>
                  <p className="text-lg leading-relaxed opacity-95">{component.text}</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'balance-dashboard':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Wallet className="text-blue-400" size={28} />
                Financial Dashboard
                {component.trend === 'positive' && (
                  <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm font-medium border border-green-700">
                    Healthy
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Current Balance</p>
                      <p className="text-3xl font-bold mt-1">₹{component.balance.toLocaleString()}</p>
                    </div>
                    <ArrowUpRight size={32} className="opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Income</p>
                      <p className="text-3xl font-bold mt-1">₹{component.income.toLocaleString()}</p>
                    </div>
                    <TrendingUp size={32} className="opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                      <p className="text-3xl font-bold mt-1">₹{component.expenses.toLocaleString()}</p>
                    </div>
                    <ArrowDownRight size={32} className="opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'balance-chart':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={24} className="text-purple-400" />
                Financial Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={component.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                      labelStyle={{ color: '#fff' }}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                      {component.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'expense-analytics':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PieChart size={24} className="text-red-400" />
                Expense Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {component.data.map((item, idx) => {
                  const percentage = ((item.value / component.total) * 100).toFixed(1)
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-200">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">₹{item.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{percentage}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'expense-bar-chart':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">📊 Expense Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={component.data} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="label" type="category" stroke="#9ca3af" width={80} />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {component.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'expense-pie-chart':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">🥧 Expense Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={component.data}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                      labelStyle={{ fill: '#fff', fontSize: '12px' }}
                    >
                      {component.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'income-analytics':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-green-400" />
                Income Analytics
              </h3>
              <div className="space-y-3">
                {component.data.map((item, idx) => {
                  const percentage = ((item.value / component.total) * 100).toFixed(1)
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        <span className="font-medium text-gray-200">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-300">₹{item.value.toLocaleString()}</p>
                        <p className="text-sm text-green-400">{percentage}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'income-bar-chart':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl shadow-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">💰 Income Sources</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={component.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {component.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )

      case 'ai-insights':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target size={24} className="text-purple-400" />
                AI Insights & Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-3">📊 Key Insights</h4>
                  <div className="space-y-2">
                    {component.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-200">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-300 mb-3">💡 Recommendations</h4>
                  <div className="space-y-2">
                    {component.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Target size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-200">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'error':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-red-900 border border-red-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle size={20} />
                <span>{component.message}</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl p-6 shadow-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <div>
            <h3 className="font-semibold text-white">Generating Enhanced UI...</h3>
            <p className="text-sm text-gray-300">Creating charts and analytics for your query</p>
          </div>
        </div>
      </div>
    )
  }

  if (uiComponents.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {uiComponents.map((component, index) => renderComponent(component, index))}
    </div>
  )
}