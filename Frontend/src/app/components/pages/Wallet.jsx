'use client'

import { CreditCard, Plus, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useFinancial } from '../../context/FinancialContext'

export default function Wallet() {
  const [showBalance, setShowBalance] = useState(true)
  const { getFinancialSummary, loading } = useFinancial()

  if (loading) {
    return <div className="p-10">Loading...</div>
  }

  const summary = getFinancialSummary()

  const accounts = [
    { id: 1, name: 'Primary Account', type: 'Bank', balance: summary.totalBalance, last4: '4242' },
    { id: 2, name: 'Savings Account', type: 'Bank', balance: summary.thisMonthSavings > 0 ? summary.thisMonthSavings : 0, last4: '1234' },
  ]

  const cards = [
    { id: 1, name: 'Visa Platinum', last4: '4242', expiry: '12/25' },
    { id: 2, name: 'SBI Cashback Card', last4: '5678', expiry: '08/26' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-[#0f0a0a] dark:via-[#1a0f0f] dark:to-black p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
          <p className="text-gray-500 dark:text-[#a89f9f] mt-2">
            Manage your accounts and payment methods.
          </p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white 
          bg-gradient-to-r from-orange-500 to-orange-600 
          shadow-md  hover:scale-105 transition">
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* TOTAL BALANCE */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 
        rounded-2xl p-8 text-white  border-white/10">

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

            <div className="mt-4 text-sm opacity-90">
              <p>Income: ₹{summary.totalIncome.toFixed(2)}</p>
              <p>Expenses: ₹{summary.totalExpenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm opacity-90">Last updated</p>
            <p className="text-lg font-semibold">Today</p>
          </div>
        </div>
      </div>

      {/* ACCOUNTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Bank Accounts</h2>

        <div className="grid md:grid-cols-3 gap-4">

          {accounts.map((account) => (
            <div key={account.id}
              className="bg-white/80 dark:bg-[#1a0f0f]/80 backdrop-blur-md 
              border border-white/20 dark:border-[#2a1a1a] 
              rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition">

              <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mb-3"></div>

              <h3 className="font-semibold text-gray-900 dark:text-white">{account.name}</h3>
              <p className="text-sm text-gray-500 dark:text-[#a89f9f]">{account.type}</p>

              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-[#a89f9f]">Balance</p>
                <p className="text-2xl font-bold text-orange-500">
                  ₹{account.balance.toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-[#a89f9f] mt-2">
                •••• {account.last4}
              </p>

              <button className="w-full mt-4 py-2 rounded-lg text-sm border 
                hover:bg-orange-50 dark:hover:bg-[#221212] transition">
                View Details
              </button>
            </div>
          ))}

          {/* ADD ACCOUNT */}
          <div className="bg-white/80 dark:bg-[#140a0a]/80 backdrop-blur-md 
            border-2 border-dashed border-gray-300 dark:border-[#2a1a1a] 
            rounded-xl p-6 flex flex-col items-center justify-center 
            hover:bg-orange-50 dark:hover:bg-[#221212] transition cursor-pointer">

            <Plus size={32} className="text-gray-400 mb-2" />
            <h3 className="font-semibold">Add Account</h3>
            <p className="text-sm text-gray-500 mb-4">Connect a new bank account</p>

            <button className="px-4 py-2 rounded-lg text-white font-semibold 
              bg-gradient-to-r from-orange-500 to-orange-600 
              hover:scale-105 transition">
              Connect
            </button>
          </div>

        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white/80 dark:bg-[#1a0f0f]/80 backdrop-blur-md 
        border border-white/20 dark:border-[#2a1a1a] 
        rounded-xl p-6 shadow-lg">

        <h2 className="text-xl font-semibold mb-4">This Month Summary</h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-xl font-bold text-green-500">
              ₹{summary.thisMonthIncome.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-xl font-bold text-red-500">
              ₹{summary.thisMonthExpenses.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Savings</p>
            <p className="text-xl font-bold text-orange-500">
              ₹{summary.thisMonthSavings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

        {cards.map((card) => (
          <div key={card.id}
            className="bg-white/80 dark:bg-[#1a0f0f]/80 backdrop-blur-md 
            border border-white/20 dark:border-[#2a1a1a] 
            rounded-xl p-5 flex justify-between items-center mb-3 
            hover:bg-orange-50 dark:hover:bg-[#221212] transition">

            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-[#2a1a1a] p-3 rounded-lg">
                <CreditCard size={24} className="text-orange-500" />
              </div>

              <div>
                <h3 className="font-semibold">{card.name}</h3>
                <p className="text-sm text-gray-500">
                  •••• {card.last4} • Expires {card.expiry}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="text-sm hover:text-orange-500">Edit</button>

              <button className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition">
                Remove
              </button>
            </div>
          </div>
        ))}

        <button className="
    w-full flex items-center justify-center gap-2
    py-4 rounded-xl font-semibold text-sm
    border-2 border-dashed 
    border-gray-300 dark:border-[#2a1a1a]

    bg-white/70 dark:bg-[#140a0a]/70 backdrop-blur-md

    text-orange-500

    hover:bg-orange-50 dark:hover:bg-[#221212]
    hover:scale-[1.02]
    transition-all duration-200
  ">
    <Plus size={18} />
    Add Payment Method
  </button>

      </div>

      {/* CONNECTED APPS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Connected Apps</h2>

        <div className="bg-white/80 dark:bg-[#1a0f0f]/80 backdrop-blur-md 
          border border-white/20 dark:border-[#2a1a1a] 
          rounded-xl p-6">

          <p className="text-gray-500 mb-4">
            No apps connected yet. Connect an app to sync your transactions automatically.
          </p>

          <button className="px-4 py-2 rounded-lg text-white font-semibold 
            bg-gradient-to-r from-orange-500 to-orange-600 
            hover:scale-105 transition">
            Browse Apps
          </button>
        </div>
      </div>

    </div>
  )
}