'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react'

export default function SimpleDynamicUI({ question, onResponse }) {
  const { getFinancialSummary, askFinancialQuestion } = useFinancial()
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [uiComponents, setUiComponents] = useState([])

  useEffect(() => {
    if (question) {
      generateUI(question)
    }
  }, [question])

  const generateUI = async (userQuestion) => {
    setIsLoading(true)
    setResponse(null)
    setUiComponents([])

    try {
      // Get financial data
      const summary = getFinancialSummary()
      const apiResponse = await askFinancialQuestion(userQuestion)
      
      setResponse(apiResponse)
      
      // Generate simple UI components based on question
      const components = createComponents(userQuestion, apiResponse, summary)
      setUiComponents(components)
      
      if (onResponse) {
        onResponse(apiResponse)
      }
    } catch (error) {
      console.error('Error generating UI:', error)
      setUiComponents([{
        type: 'error',
        message: 'Unable to generate UI for this query'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const createComponents = (question, apiResponse, summary) => {
    const questionLower = question.toLowerCase()
    const components = []

    // Add animated response text
    components.push({
      type: 'response',
      text: apiResponse.insight,
      animated: true
    })

    // Add specific UI based on question type
    if (questionLower.includes('balance') || questionLower.includes('wallet')) {
      components.push({
        type: 'balance-card',
        balance: summary.totalBalance,
        income: summary.totalIncome,
        expenses: summary.totalExpenses,
        trend: summary.totalBalance > 10000 ? 'positive' : 'neutral'
      })
      
      // Add financial health indicator
      components.push({
        type: 'health-indicator',
        ratio: summary.totalExpenses / summary.totalIncome,
        savings: summary.totalBalance
      })
    }

    if (questionLower.includes('expense') && apiResponse.data) {
      components.push({
        type: 'expense-list',
        data: apiResponse.data,
        total: summary.totalExpenses
      })
      
      // Add spending insights
      const highestExpense = apiResponse.data[0]
      components.push({
        type: 'insight-card',
        title: '💡 Spending Insight',
        message: `Your highest expense category is ${highestExpense.label} at ₹${highestExpense.value}. Consider reviewing this category for potential savings.`
      })
    }

    if (questionLower.includes('income') && apiResponse.data) {
      components.push({
        type: 'income-list',
        data: apiResponse.data,
        total: summary.totalIncome
      })
      
      // Add income diversification insight
      components.push({
        type: 'insight-card',
        title: '📈 Income Insight',
        message: `You have ${apiResponse.data.length} income sources. Consider diversifying further for financial stability.`
      })
    }

    return components
  }

  const renderComponent = (component, index) => {
    switch (component.type) {
      case 'response':
        return (
          <div key={index} className={`bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 transform transition-all duration-700 ${component.animated ? 'animate-pulse' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white p-2 rounded-full">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">AI Financial Assistant</h3>
                <p className="text-blue-800">{component.text}</p>
              </div>
            </div>
          </div>
        )

      case 'balance-card':
        return (
          <div key={index} className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg mb-4 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  💰 Current Balance
                  {component.trend === 'positive' && <span className="text-xs bg-green-600 px-2 py-1 rounded">Healthy</span>}
                </h3>
                <p className="text-3xl font-bold">₹{component.balance.toFixed(2)}</p>
              </div>
              <Wallet size={48} className="opacity-80" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="text-sm">Income</span>
                </div>
                <p className="font-semibold">₹{component.income.toFixed(2)}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} />
                  <span className="text-sm">Expenses</span>
                </div>
                <p className="font-semibold">₹{component.expenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )

      case 'health-indicator':
        const healthStatus = component.ratio < 0.5 ? 'excellent' : component.ratio < 0.7 ? 'good' : 'caution'
        const healthColor = healthStatus === 'excellent' ? 'green' : healthStatus === 'good' ? 'yellow' : 'red'
        
        return (
          <div key={index} className={`bg-${healthColor}-50 border border-${healthColor}-200 p-4 rounded-lg mb-4`}>
            <h3 className={`font-semibold text-${healthColor}-800 mb-2`}>
              🏥 Financial Health: {healthStatus.toUpperCase()}
            </h3>
            <p className={`text-${healthColor}-700 text-sm`}>
              You're spending {(component.ratio * 100).toFixed(1)}% of your income. 
              {healthStatus === 'excellent' && ' Great job managing your finances!'}
              {healthStatus === 'good' && ' You\'re doing well, consider saving more.'}
              {healthStatus === 'caution' && ' Consider reducing expenses to improve your financial health.'}
            </p>
          </div>
        )

      case 'insight-card':
        return (
          <div key={index} className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-800 mb-2">{component.title}</h3>
            <p className="text-purple-700 text-sm">{component.message}</p>
          </div>
        )

      case 'expense-list':
        return (
          <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <PieChart size={20} />
              Expense Breakdown
            </h3>
            <div className="space-y-2">
              {component.data.map((item, idx) => {
                const percentage = ((item.value / component.total) * 100).toFixed(1)
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-gray-700">{item.label}</span>
                    <div className="text-right">
                      <span className="font-semibold text-red-600">₹{item.value}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'income-list':
        return (
          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <TrendingUp size={20} />
              Income Sources
            </h3>
            <div className="space-y-2">
              {component.data.map((item, idx) => {
                const percentage = ((item.value / component.total) * 100).toFixed(1)
                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-gray-700">{item.label}</span>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">₹{item.value}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'error':
        return (
          <div key={index} className="bg-red-100 p-4 rounded-lg border border-red-300 mb-4">
            <p className="text-red-800">{component.message}</p>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
          <span className="text-purple-700">Generating dynamic UI...</span>
        </div>
      </div>
    )
  }

  if (uiComponents.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {uiComponents.map((component, index) => renderComponent(component, index))}
    </div>
  )
}