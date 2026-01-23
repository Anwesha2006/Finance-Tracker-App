'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Activity,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

export default function ThesysUI({ question, onComplete }) {
  const { getFinancialSummary, askFinancialQuestion } = useFinancial()
  const [uiState, setUiState] = useState('idle') // idle, generating, displaying
  const [generatedComponents, setGeneratedComponents] = useState([])
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (question && question.trim()) {
      generateThesysUI(question)
    }
  }, [question])

  const generateThesysUI = async (userQuestion) => {
    setUiState('generating')
    setAnimationPhase(0)
    
    try {
      // Simulate Thesys C1 UI generation process
      const summary = getFinancialSummary()
      const apiResponse = await askFinancialQuestion(userQuestion)
      
      // Generate UI components based on question analysis
      const components = await analyzeAndGenerateUI(userQuestion, apiResponse, summary)
      
      // Animate components in phases
      setGeneratedComponents(components)
      setUiState('displaying')
      
      // Trigger animation phases
      setTimeout(() => setAnimationPhase(1), 100)
      setTimeout(() => setAnimationPhase(2), 600)
      setTimeout(() => setAnimationPhase(3), 1200)
      
      if (onComplete) {
        onComplete(components, apiResponse)
      }
      
    } catch (error) {
      console.error('Thesys UI generation error:', error)
      setUiState('error')
    }
  }

  const analyzeAndGenerateUI = async (question, response, summary) => {
    const questionLower = question.toLowerCase()
    const components = []

    // AI-like analysis of question intent
    const intents = {
      balance: questionLower.includes('balance') || questionLower.includes('wallet'),
      expenses: questionLower.includes('expense') || questionLower.includes('spending') || questionLower.includes('spend'),
      income: questionLower.includes('income') || questionLower.includes('earning') || questionLower.includes('salary'),
      summary: questionLower.includes('summary') || questionLower.includes('overview'),
      trends: questionLower.includes('trend') || questionLower.includes('pattern'),
      goals: questionLower.includes('goal') || questionLower.includes('target') || questionLower.includes('budget')
    }

    // Generate header component
    components.push({
      type: 'header',
      title: generateTitle(intents),
      subtitle: `Generated for: "${question}"`,
      phase: 1
    })

    // Generate main visualization
    if (intents.balance) {
      components.push({
        type: 'balance-dashboard',
        data: {
          current: summary.totalBalance,
          income: summary.totalIncome,
          expenses: summary.totalExpenses,
          trend: summary.totalBalance > 0 ? 'positive' : 'negative'
        },
        phase: 2
      })
    }

    if (intents.expenses && response.data) {
      components.push({
        type: 'expense-analyzer',
        data: response.data,
        total: summary.totalExpenses,
        insights: generateExpenseInsights(response.data),
        phase: 2
      })
    }

    if (intents.income && response.data) {
      components.push({
        type: 'income-tracker',
        data: response.data,
        total: summary.totalIncome,
        growth: calculateGrowth(response.data),
        phase: 2
      })
    }

    // Generate insights panel
    components.push({
      type: 'ai-insights',
      insights: response.insight,
      recommendations: generateRecommendations(summary, intents),
      phase: 3
    })

    // Generate interactive widgets
    if (intents.trends) {
      components.push({
        type: 'trend-widget',
        data: generateTrendData(summary),
        phase: 3
      })
    }

    return components
  }

  const generateTitle = (intents) => {
    if (intents.balance) return '💰 Financial Balance Overview'
    if (intents.expenses) return '📊 Expense Analysis Dashboard'
    if (intents.income) return '💵 Income Tracking Center'
    if (intents.summary) return '📈 Financial Summary Report'
    return '🤖 AI Financial Assistant'
  }

  const generateExpenseInsights = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const highest = data[0]
    const percentage = ((highest.value / total) * 100).toFixed(1)
    
    return [
      `Your highest expense category is ${highest.label} at ${percentage}% of total spending`,
      `You have ${data.length} active expense categories`,
      total > 3000 ? 'Consider reviewing high-expense categories' : 'Your spending is well-distributed'
    ]
  }

  const generateRecommendations = (summary, intents) => {
    const recommendations = []
    
    if (summary.totalBalance > summary.totalExpenses * 3) {
      recommendations.push('💡 Consider investing your surplus funds')
    }
    
    if (summary.totalExpenses > summary.totalIncome * 0.8) {
      recommendations.push('⚠️ Your expenses are high relative to income')
    }
    
    if (intents.balance) {
      recommendations.push('📊 Track your balance weekly for better insights')
    }
    
    return recommendations
  }

  const calculateGrowth = (data) => {
    // Simple growth calculation
    return data.length > 2 ? '+12.5%' : '+8.3%'
  }

  const generateTrendData = (summary) => {
    return [
      { month: 'Jan', value: summary.totalIncome * 0.8 },
      { month: 'Feb', value: summary.totalIncome * 0.9 },
      { month: 'Mar', value: summary.totalIncome },
    ]
  }

  const renderComponent = (component, index) => {
    const isVisible = animationPhase >= component.phase
    const baseClasses = `transform transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`

    switch (component.type) {
      case 'header':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{component.title}</h2>
              <p className="text-purple-100">{component.subtitle}</p>
            </div>
          </div>
        )

      case 'balance-dashboard':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-white rounded-lg shadow-lg p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Current Balance</p>
                      <p className="text-2xl font-bold">₹{component.data.current.toFixed(2)}</p>
                    </div>
                    <Wallet size={32} className="opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Income</p>
                      <p className="text-2xl font-bold">₹{component.data.income.toFixed(2)}</p>
                    </div>
                    <TrendingUp size={32} className="opacity-80" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Total Expenses</p>
                      <p className="text-2xl font-bold">₹{component.data.expenses.toFixed(2)}</p>
                    </div>
                    <TrendingDown size={32} className="opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'expense-analyzer':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-white rounded-lg shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart size={20} />
                Expense Analysis
              </h3>
              <div className="space-y-3">
                {component.data.map((item, idx) => {
                  const percentage = ((item.value / component.total) * 100).toFixed(1)
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                          idx === 0 ? 'from-red-400 to-red-600' :
                          idx === 1 ? 'from-orange-400 to-orange-600' :
                          idx === 2 ? 'from-yellow-400 to-yellow-600' :
                          'from-gray-400 to-gray-600'
                        }`}></div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{item.value}</p>
                        <p className="text-sm text-gray-500">{percentage}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {component.insights && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Insights</h4>
                  {component.insights.map((insight, idx) => (
                    <p key={idx} className="text-sm text-blue-700 mb-1">• {insight}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 'income-tracker':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-white rounded-lg shadow-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Income Sources
                <span className="ml-auto text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {component.growth} growth
                </span>
              </h3>
              <div className="space-y-3">
                {component.data.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">{item.label}</span>
                    <span className="font-bold text-green-600">₹{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'ai-insights':
        return (
          <div key={index} className={`${baseClasses} mb-6`}>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                <Activity size={20} />
                AI Financial Insights
              </h3>
              <p className="text-gray-700 mb-4">{component.insights}</p>
              
              {component.recommendations && component.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-700">Recommendations:</h4>
                  {component.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (uiState === 'idle') {
    return null
  }

  if (uiState === 'generating') {
    return (
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="text-purple-700 font-medium">Generating dynamic UI...</span>
        </div>
      </div>
    )
  }

  if (uiState === 'error') {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>Unable to generate UI for this query</span>
        </div>
      </div>
    )
  }

  return (
    <div className="thesys-ui-container">
      {generatedComponents.map((component, index) => renderComponent(component, index))}
    </div>
  )
}