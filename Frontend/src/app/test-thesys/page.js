'use client'

import { useState } from 'react'
import ThesysUI from '../components/ThesysUI'

export default function TestThesysPage() {
  const [question, setQuestion] = useState('')
  const [trigger, setTrigger] = useState('')

  const testQuestions = [
    "What is my wallet balance?",
    "What are my expenses?", 
    "Show my income sources",
    "Give me a financial summary"
  ]

  const handleTest = (testQuestion) => {
    setQuestion(testQuestion)
    setTrigger(testQuestion + Date.now()) // Force re-render
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🤖 Thesys UI Test Page</h1>
          <p className="text-gray-600 mb-6">Test the dynamic UI generation system</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            {testQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleTest(q)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Or type your own question..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setTrigger(question + Date.now())}
              className="mt-2 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
            >
              Generate UI
            </button>
          </div>
        </div>

        {/* Thesys UI Component */}
        {trigger && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Generated UI:</h2>
            <ThesysUI 
              question={trigger}
              onComplete={(components, response) => {
                console.log('Thesys UI completed:', components, response)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}