'use client'

import { CreditCard, Plus, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useFinancial } from '../../context/FinancialContext'

export default function Wallet() {
  const [showBalance, setShowBalance] = useState(true)
  const { getFinancialSummary, loading } = useFinancial()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="bg-muted rounded-lg h-32 animate-pulse"></div>
      </div>
    )
  }

  const summary = getFinancialSummary()

  // Mock accounts data - in a real app, this would come from the API
  const accounts = [
    { 
      id: 1, 
      name: 'Primary Account', 
      type: 'Bank', 
      balance: summary.totalBalance, 
      last4: '4242' 
    },
    { 
      id: 2, 
      name: 'Savings Account', 
      type: 'Bank', 
      balance: summary.thisMonthSavings > 0 ? summary.thisMonthSavings : 0, 
      last4: '1234' 
    },
  ]

  const cards = [
    { id: 1, name: 'Visa Platinum', last4: '4242', expiry: '12/25' },
    { id: 2, name: 'SBI Cashback Card', last4: '5678', expiry: '08/26' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your accounts and payment methods.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold">
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* Total Balance */}
      <div className="bg-gradient-to-r from-accent to-accent/80 rounded-lg p-8 text-accent-foreground">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg opacity-90">Total Balance</p>
            <div className="flex items-center gap-3 mt-4">
              <h2 className="text-4xl font-bold">
                {showBalance ? `₹${summary.totalBalance.toFixed(2)}` : '••••••'}
              </h2>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm opacity-90">
                Income: ₹{summary.totalIncome.toFixed(2)}
              </p>
              <p className="text-sm opacity-90">
                Expenses: ₹{summary.totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Last updated</p>
            <p className="text-lg font-semibold">Today</p>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="font-semibold">{account.name}</h3>
              <p className="text-sm text-muted-foreground">{account.type}</p>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold text-accent">
                  ₹{account.balance.toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                •••• {account.last4}
              </p>

              <button className="w-full mt-4 py-2 border rounded-lg">
                View Details
              </button>
            </div>
          ))}
          
          {/* Add Account Card */}
          <div className="bg-card border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <Plus size={32} className="text-muted-foreground mb-2" />
            <h3 className="font-semibold mb-1">Add Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect a new bank account
            </p>
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-semibold">
              Connect
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">This Month Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-xl font-bold text-accent">
              ₹{summary.thisMonthIncome.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-xl font-bold text-destructive">
              ₹{summary.thisMonthExpenses.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Savings</p>
            <p className={`text-xl font-bold ${
              summary.thisMonthSavings > 0 ? 'text-accent' : 'text-destructive'
            }`}>
              ₹{summary.thisMonthSavings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-card border border-border rounded-lg p-6 flex justify-between items-center mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <CreditCard size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{card.name}</h3>
                <p className="text-sm text-muted-foreground">
                  •••• {card.last4} • Expires {card.expiry}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg">Edit</button>
              <button className="px-4 py-2 border border-destructive text-destructive rounded-lg">
                Remove
              </button>
            </div>
          </div>
        ))}

        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-accent rounded-lg text-accent font-semibold">
          <Plus size={20} />
          Add Payment Method
        </button>
      </div>

      {/* Connected Apps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Apps</h2>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground mb-4">
            No apps connected yet. Connect an app to sync your transactions automatically.
          </p>
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold">
            Browse Apps
          </button>
        </div>
      </div>
    </div>
  )
}