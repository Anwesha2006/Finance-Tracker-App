'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

export default function History() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const transactions = [
    { id: 1, name: 'Salary Deposit', amount: 3500, type: 'income', date: '2024-01-18', category: 'Salary' },
    { id: 2, name: 'Grocery Store', amount: -125.5, type: 'expense', date: '2024-01-17', category: 'Groceries' },
    { id: 3, name: 'Electricity Bill', amount: -89.99, type: 'expense', date: '2024-01-16', category: 'Utilities' },
    { id: 4, name: 'Freelance Project', amount: 500, type: 'income', date: '2024-01-15', category: 'Income' },
    { id: 5, name: 'Restaurant', amount: -45.75, type: 'expense', date: '2024-01-14', category: 'Dining' },
    { id: 6, name: 'Gas Station', amount: -52.3, type: 'expense', date: '2024-01-13', category: 'Transport' },
    { id: 7, name: 'Movie Tickets', amount: -30, type: 'expense', date: '2024-01-12', category: 'Entertainment' },
    { id: 8, name: 'Bonus Received', amount: 1200, type: 'income', date: '2024-01-11', category: 'Bonus' },
    { id: 9, name: 'Internet Bill', amount: -49.99, type: 'expense', date: '2024-01-10', category: 'Utilities' },
    { id: 10, name: 'Gym Membership', amount: -50, type: 'expense', date: '2024-01-09', category: 'Health' },
  ]

  const filteredTransactions = transactions.filter((txn) => {
    const matchesFilter = filter === 'all' || txn.type === filter
    const matchesSearch =
      txn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your past transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg"
          />
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg pr-10"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
          <Filter className="absolute right-3 top-2.5 text-muted-foreground" size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-5 p-4 bg-muted font-semibold">
          <div>Transaction</div>
          <div>Category</div>
          <div>Date</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Type</div>
        </div>

        {filteredTransactions.map((txn) => (
          <div
            key={txn.id}
            className="grid md:grid-cols-5 p-4 border-t hover:bg-muted"
          >
            <div>{txn.name}</div>
            <div>{txn.category}</div>
            <div>{txn.date}</div>
            <div
              className={`text-right font-semibold ${
                txn.type === 'income' ? 'text-accent' : 'text-destructive'
              }`}
            >
              {txn.type === 'income' ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(2)}
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  txn.type === 'income'
                    ? 'bg-accent bg-opacity-10 text-accent'
                    : 'bg-destructive bg-opacity-10 text-destructive'
                }`}
              >
                {txn.type === 'income' ? 'Income' : 'Expense'}
              </span>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No transactions found.
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Income"
          value={`₹${filteredTransactions
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0)
            .toFixed(2)}`}
          accent
        />
        <SummaryCard
          label="Total Expenses"
          value={`₹${Math.abs(
            filteredTransactions
              .filter((t) => t.type === 'expense')
              .reduce((s, t) => s + t.amount, 0),
          ).toFixed(2)}`}
          destructive
        />
        <SummaryCard
          label="Net Balance"
          value={`₹${filteredTransactions
            .reduce((s, t) => s + t.amount, 0)
            .toFixed(2)}`}
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, value, accent, destructive }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`text-2xl font-bold mt-2 ${
          accent
            ? 'text-accent'
            : destructive
            ? 'text-destructive'
            : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
