'use client'

import { ArrowUp, ArrowDown, Wallet, TrendingUp } from 'lucide-react'
import { useFinancial } from '../../context/FinancialContext'
import LiveFinancialWidget from '../LiveFinancialWidget'

export default function Dashboard() {
  const { getFinancialSummary, loading } = useFinancial()
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-4"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const summary = getFinancialSummary()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={`₹${summary.totalBalance.toFixed(2)}`}
          icon={<Wallet size={24} />}
          accent
        />
        <StatCard
          title="This Month Income"
          value={`₹${summary.thisMonthIncome.toFixed(2)}`}
          icon={<ArrowUp size={24} />}
          accent
        />
        <StatCard
          title="This Month Expenses"
          value={`₹${summary.thisMonthExpenses.toFixed(2)}`}
          icon={<ArrowDown size={24} />}
          destructive
        />
        <StatCard
          title="This Month Savings"
          value={`₹${summary.thisMonthSavings.toFixed(2)}`}
          icon={<TrendingUp size={24} />}
          accent={summary.thisMonthSavings > 0}
          destructive={summary.thisMonthSavings < 0}
        />
      </div>

      {/* Live Financial Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Transactions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

            {summary.transactions.map((txn, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 rounded-lg bg-muted mb-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'income'
                        ? 'bg-accent bg-opacity-10'
                        : 'bg-destructive bg-opacity-10'
                    }`}
                  >
                    {txn.type === 'income' ? (
                      <ArrowUp className="text-accent" size={20} />
                    ) : (
                      <ArrowDown className="text-destructive" size={20} />
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{txn.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p
                  className={`font-semibold ${
                    txn.type === 'income' ? 'text-accent' : 'text-destructive'
                  }`}
                >
                  {txn.type === 'income' ? '+' : ''}₹{Math.abs(txn.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <LiveFinancialWidget />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-accent text-accent-foreground py-3 rounded-lg font-semibold">
          Add Transaction
        </button>
        <button className="bg-muted py-3 rounded-lg font-semibold">
          View Reports
        </button>
        <button className="bg-muted py-3 rounded-lg font-semibold">
          Set Budget
        </button>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, accent, destructive }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3
            className={`text-2xl font-bold mt-2 ${
              accent
                ? 'text-accent'
                : destructive
                ? 'text-destructive'
                : 'text-foreground'
            }`}
          >
            {value}
          </h3>
        </div>
        <div className="bg-accent bg-opacity-10 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}