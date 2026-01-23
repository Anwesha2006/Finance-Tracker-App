'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'How are my spending patterns looking this month?',
      sender: 'user',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      text:
        'Your spending has increased by 15% compared to last month. The main driver is food & dining at 32% of your expenses. Would you like me to show you the category breakdown or compare it to your budget?',
      sender: 'assistant',
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const responses = [
        'Based on your transaction history, I see a pattern emerging. Your entertainment spending peaks on weekends.',
        "I found an unusual charge of $500 from last week that doesn't match your typical spending patterns. Would you like to investigate?",
        'Your savings rate has improved by 8% this quarter. Would you like suggestions on optimizing your portfolio?',
        "I notice you've been tracking your expenses more carefully. This will help me provide better insights.",
      ]

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Financial Co-Pilot
          </h2>
          <p className="text-muted-foreground">
            Ask me anything about your finances. I understand natural language
            questions about money.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="text-4xl">💬</div>
                  <p className="text-muted-foreground max-w-xs">
                    Start a conversation about your finances. Ask about
                    spending, savings, trends, or anomalies.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-accent-foreground/70'
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
              ))
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 bg-background">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your spending, savings, or financial goals..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
