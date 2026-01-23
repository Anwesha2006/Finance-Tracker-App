'use client'

import React, { useState, useEffect } from 'react'
import { Bell, X, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

export default function DynamicNotifications({ trigger }) {
  const [notifications, setNotifications] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (trigger) {
      generateNotification(trigger)
    }
  }, [trigger])

  const generateNotification = (query) => {
    const queryLower = query.toLowerCase()
    let notification = {}

    if (queryLower.includes('balance') || queryLower.includes('wallet')) {
      notification = {
        id: Date.now(),
        type: 'info',
        icon: CheckCircle,
        title: 'Balance Updated',
        message: 'Your wallet balance has been calculated and displayed',
        color: 'blue',
        duration: 4000
      }
    } else if (queryLower.includes('expense') || queryLower.includes('spending')) {
      notification = {
        id: Date.now(),
        type: 'warning',
        icon: TrendingDown,
        title: 'Expense Analysis',
        message: 'Your spending patterns have been analyzed',
        color: 'orange',
        duration: 4000
      }
    } else if (queryLower.includes('income')) {
      notification = {
        id: Date.now(),
        type: 'success',
        icon: TrendingUp,
        title: 'Income Breakdown',
        message: 'Your income sources have been categorized',
        color: 'green',
        duration: 4000
      }
    } else {
      notification = {
        id: Date.now(),
        type: 'info',
        icon: Bell,
        title: 'Financial Query Processed',
        message: 'Your financial data has been analyzed',
        color: 'purple',
        duration: 4000
      }
    }

    setNotifications(prev => [notification, ...prev.slice(0, 2)]) // Keep max 3 notifications
    setIsVisible(true)

    // Auto-remove notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, notification.duration)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const IconComponent = notification.icon
        
        return (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-lg border-l-4 border-${notification.color}-500 p-4 max-w-sm transform transition-all duration-300 animate-slide-in-right`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 mr-3 mt-0.5`}>
                <IconComponent 
                  className={`text-${notification.color}-500`} 
                  size={20} 
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-1">
                <div 
                  className={`bg-${notification.color}-500 h-1 rounded-full animate-progress`}
                  style={{ 
                    animation: `progress ${notification.duration}ms linear forwards`
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
      
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-progress {
          animation: progress var(--duration) linear forwards;
        }
      `}</style>
    </div>
  )
}