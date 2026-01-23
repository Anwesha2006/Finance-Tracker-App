'use client'

import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export default function DynamicFinancialUI({ question, onResponse }) {
  const { askFinancialQuestion, getFinancialSummary } = useFinancial()
  const [isGenerating, setIsGenerating] = useState(false)
  const [uiData, setUiData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (question) {
      generateDynamicUI(question)
    }
  }, [question])

  const generateDynamicUI = async (userQuestion) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Get financial data
      const summary = getFinancialSummary()
      const apiResponse = await askFinancialQuestion(userQuestion)

      // Create UI data based on question type
      const questionLower = userQuestion.toLowerCase()
      let uiType = 'default'
      
      if (questionLower.includes('balance') || questionLower.includes('wallet')) {
        uiType = 'balance'
      } else if (questionLower.includes('expense') || questionLower.includes('spending')) {
        uiType = 'expenses'
      } else if (questionLower.includes('income')) {
        uiType = 'income'
      }

      setUiData({
        type: uiType,
        response: apiResponse,
        summary: summary
      })

      if (onResponse) {
        onResponse(apiResponse)
      }

    } catch (error) {
      console.error('Error generating dynamic UI:', error)
      setError('Unable to generate dynamic UI for this query')
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Generating dynamic UI...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  if (!uiData) {
    return null
  }

  const { type, response, summary } = uiData

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Response Text */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <p className="text-gray-800">{response.insight}</p>
      </div>

      {/* Dynamic Widget Based on Type */}
      {type === 'balance' && (
        <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-2">💰 Current Balance</h3>
              <p className="text-2xl font-bold">₹{summary.totalBalance.toFixed(2)}</p>
            </div>
            <Wallet size={40} className="opacity-80" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span className="text-sm">Income</span>
              </div>
              <p className="font-semibold">₹{summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded">
              <div className="flex items-center gap-2">
                <TrendingDown size={16} />
                <span className="text-sm">Expenses</span>
              </div>
              <p className="font-semibold">₹{summary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Visualization */}
      {response.data && response.data.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-3 text-gray-800">
            {response.chartType === 'pie' ? '📊 Breakdown' : 
             response.chartType === 'bar' ? '📈 Overview' : 
             '📋 Data'}
          </h3>
          <div className="space-y-2">
            {response.data.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-indigo-600">₹{item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}