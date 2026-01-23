'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { useFinancial } from '../../context/FinancialContext'
import EnhancedChatUI from '../EnhancedChatUI'

export default function Chat() {
    const { askFinancialQuestion, getFinancialSummary } = useFinancial()
    const [messages, setMessages] = useState([
        {
            id: '1',
            text:
                "Hello! I'm your financial assistant. Ask me anything about your finances, spending patterns, or savings goals.",
            sender: 'assistant',
            timestamp: new Date(),
        },
    ])

    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState('')
    const [showDynamicUI, setShowDynamicUI] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const userMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        const currentInput = inputValue
        setInputValue('')
        setIsLoading(true)

        // Trigger dynamic UI generation
        setCurrentQuestion(currentInput)
        setShowDynamicUI(true)

        try {
            // Get current financial summary for context
            const summary = getFinancialSummary()
            
            // Check if user is asking about wallet balance specifically
            const questionLower = currentInput.toLowerCase()
            if (questionLower.includes('wallet balance') || 
                questionLower.includes('total balance') || 
                questionLower.includes('current balance')) {
                
                const assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    text: `Your current wallet balance is ₹${summary.totalBalance.toFixed(2)}. This includes your total income of ₹${summary.totalIncome.toFixed(2)} minus your total expenses of ₹${summary.totalExpenses.toFixed(2)}.`,
                    sender: 'assistant',
                    timestamp: new Date(),
                    chartType: 'bar',
                    chartData: [
                        { label: "Total Income", value: summary.totalIncome },
                        { label: "Total Expenses", value: summary.totalExpenses },
                        { label: "Current Balance", value: summary.totalBalance }
                    ],
                }
                
                setMessages((prev) => [...prev, assistantMessage])
                setIsLoading(false)
                return
            }

            // Use the API for other questions
            const data = await askFinancialQuestion(currentInput)

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                text: data.insight || 'I apologize, but I couldn\'t process your request.',
                sender: 'assistant',
                timestamp: new Date(),
                chartType: data.chartType,
                chartData: data.data,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error calling API:', error)
            
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I\'m having trouble processing your request right now. Please try again.',
                sender: 'assistant',
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex flex-col max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-border bg-card p-4 rounded-t-lg lg:rounded-lg sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                        <MessageCircle className="text-accent-foreground" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Financial Assistant
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            AI-powered financial insights with dynamic UI generation
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Quick Action Buttons */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <div className="flex flex-wrap gap-3 justify-center">
                    <button 
                        onClick={() => {
                            setInputValue("What is my wallet balance?")
                            handleSendMessage({ preventDefault: () => {} })
                        }}
                        className="group px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl text-sm font-semibold hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center gap-2">
                            💰 <span>Balance Dashboard</span>
                        </span>
                    </button>
                    <button 
                        onClick={() => {
                            setInputValue("What are my expenses?")
                            handleSendMessage({ preventDefault: () => {} })
                        }}
                        className="group px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl text-sm font-semibold hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center gap-2">
                            📊 <span>Expense Analytics</span>
                        </span>
                    </button>
                    <button 
                        onClick={() => {
                            setInputValue("Show my income sources")
                            handleSendMessage({ preventDefault: () => {} })
                        }}
                        className="group px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center gap-2">
                            💵 <span>Income Tracker</span>
                        </span>
                    </button>
                    <button 
                        onClick={() => {
                            setInputValue("Give me a financial summary")
                            handleSendMessage({ preventDefault: () => {} })
                        }}
                        className="group px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-purple-500 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="flex items-center gap-2">
                            📈 <span>Full Report</span>
                        </span>
                    </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-3">
                    Click a button above or type your own financial question below
                </p>
            </div>

            {/* Enhanced Dynamic UI with Charts */}
            {showDynamicUI && currentQuestion && (
                <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-700">
                    <EnhancedChatUI 
                        question={currentQuestion}
                        onResponse={(response) => {
                            console.log('Enhanced UI response:', response)
                        }}
                    />
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${message.sender === 'user'
                                    ? 'bg-accent text-accent-foreground rounded-br-none'
                                    : 'bg-card border border-border text-foreground rounded-bl-none'
                                }`}
                        >
                            <p className="text-sm md:text-base">{message.text}</p>
                            
                            {/* Show chart info if available */}
                            {message.chartType && message.chartData && (
                                <div className="mt-3 p-3 bg-muted rounded-lg">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                        Chart Type: {message.chartType}
                                    </p>
                                    <div className="space-y-1">
                                        {message.chartData.slice(0, 3).map((item, index) => (
                                            <div key={index} className="flex justify-between text-xs">
                                                <span>{item.label}</span>
                                                <span className="font-medium">₹{item.value}</span>
                                            </div>
                                        ))}
                                        {message.chartData.length > 3 && (
                                            <p className="text-xs text-muted-foreground">
                                                +{message.chartData.length - 3} more items
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <p
                                className={`text-xs mt-2 ${message.sender === 'user'
                                        ? 'text-accent-foreground opacity-70'
                                        : 'text-muted-foreground'
                                    }`}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-card border border-border px-4 py-3 rounded-lg rounded-bl-none">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div
                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                    style={{ animationDelay: '0.2s' }}
                                />
                                <div
                                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                    style={{ animationDelay: '0.4s' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-card p-4 rounded-b-lg lg:rounded-lg sticky bottom-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about your finances..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="px-4 py-2 rounded-lg bg-accent text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                        <Send size={20} />
                        <span className="hidden md:inline">Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
