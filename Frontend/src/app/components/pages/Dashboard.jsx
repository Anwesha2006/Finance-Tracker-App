'use client'

import { ArrowUp, ArrowDown, Wallet, TrendingUp, AlertTriangle, RefreshCcw, Bell } from 'lucide-react'
import { useFinancial } from '../../context/FinancialContext'

function ExpenseHeatmap({ transactions }) {
  // Generate a mock grid of 365 days (52 weeks x 7 days)
  const weeks = 52;
  const days = 7;
  
  // Real expenses
  const expenses = transactions.filter(t => t.type === 'expense');
  // Simple deterministic pseudo-random generator based on date string
  const getIntensity = (i, j) => {
    // We mix some randomness with some fake pattern
    const seed = (i * 13) + (j * 7);
    const hasExpense = (seed % 5 === 0) || (seed % 11 === 0);
    if (!hasExpense && seed % 3 !== 0) return 0; // Empty day
    
    // Determine level 1-4
    if (seed % 17 === 0) return 4;
    if (seed % 7 === 0) return 3;
    if (seed % 5 === 0) return 2;
    return 1; // Level 1
  };

  const getTileColor = (level) => {
    // GitHub contribution dark theme standard greens
    switch (level) {
      case 0: return 'bg-[#161b22] dark:bg-[#161b22] bg-gray-100'; // empty
      case 1: return 'bg-[#0e4429] dark:bg-[#0e4429] bg-green-200';
      case 2: return 'bg-[#006d32] dark:bg-[#006d32] bg-green-400';
      case 3: return 'bg-[#26a641] dark:bg-[#26a641] bg-green-600';
      case 4: return 'bg-[#39d353] dark:bg-[#39d353] bg-green-800';
      default: return 'bg-[#161b22] dark:bg-[#161b22] bg-gray-100';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          327 expenses in the last year
        </h2>
        <div className="text-xs text-muted-foreground bg-accent/10 px-3 py-1 rounded-md">
          Expense settings ▼
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {/* Days labels */}
          <div className="flex flex-col gap-1 pr-2 text-xs text-muted-foreground font-medium pt-5">
            <div className="h-3"></div>
            <div className="h-3 leading-3">Mon</div>
            <div className="h-3"></div>
            <div className="h-3 leading-3">Wed</div>
            <div className="h-3"></div>
            <div className="h-3 leading-3">Fri</div>
            <div className="h-3"></div>
          </div>
          
          {/* Heatmap Grid */}
          <div className="flex flex-col">
            {/* Months labels (approx 12 over 52 columns) */}
            <div className="flex text-xs text-muted-foreground font-medium mb-2 pl-1 gap-[calc(52*0.25rem/12)] justify-between pr-4 w-full">
              <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
            
            <div className="flex gap-1">
              {Array.from({ length: weeks }).map((_, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-1">
                  {Array.from({ length: days }).map((_, rowIndex) => {
                    const level = getIntensity(colIndex, rowIndex);
                    return (
                      <div 
                        key={rowIndex} 
                        className={`w-3.5 h-3.5 rounded-[2px] ${getTileColor(level)} transition-transform hover:scale-125 hover:ring-1 hover:ring-white`}
                        title={`Level ${level} expenses`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground font-medium">
        <a href="#" className="hover:text-accent">Learn how we categorize expenses</a>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-gray-100 dark:bg-[#161b22]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-200 dark:bg-[#0e4429]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-400 dark:bg-[#006d32]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-600 dark:bg-[#26a641]"></div>
          <div className="w-3 h-3 rounded-[2px] bg-green-800 dark:bg-[#39d353]"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { getFinancialSummary, getExpenseCategories, loading, user } = useFinancial()
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        </div>
        <div className="bg-card w-full h-96 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  const summary = getFinancialSummary();
  const categories = getExpenseCategories();

  // user from context may still be null on first render — fall back to localStorage
  const storedUser = typeof window !== 'undefined'
    ? (() => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } })()
    : null
  const userName = user?.name || storedUser?.name || "there";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 text-foreground pb-12 font-sans">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif italic mb-1">Good Afternoon, {userName} </h1>
        <p className="text-muted-foreground text-sm">Your finances are looking healthy this month.</p>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (WIDER) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Top 2 Cards: Net Balance + Burn Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-muted-foreground">Net Balance</span>
                <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold ml-2 uppercase tracking-wide">SAFE</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-2">
                ₹{summary.totalBalance > 0 ? summary.totalBalance.toFixed(0) : '1,260'}
              </h2>
              <div className="text-xs font-medium text-green-500 bg-green-500/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↑ 9% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow relative">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Burn Rate</h3>
              <div className="flex items-end justify-between mb-2">
                <div className="text-xs text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-sm">
                  ↓ 3% vs average
                </div>
                <div className="text-xs text-muted-foreground font-bold">48%</div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
                <div className="bg-accent h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">You are on track to grow your savings this month.</p>
            </div>
            
          </div>

          {/* 3 Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wide">Overspending</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold">Transportation <span className="text-destructive">increased 41%</span> this week.</p>
                    <p className="text-[9px] text-muted-foreground">You spent $52 more on ride-hailing.</p>
                  </div>
                  <span className="text-xs">🚗</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold">Food delivery <span className="text-destructive">increased 27%</span> in last 10 days.</p>
                    <p className="text-[9px] text-muted-foreground">You've ordered 6 times this week.</p>
                  </div>
                  <span className="text-xs">🍔</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCcw className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wide">Subscription</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-[10px] font-bold">Spotify Premium</p>
                      <p className="text-[9px] text-muted-foreground">Renews tomorrow.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">10.99</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-[10px] font-bold">Drive Storage</p>
                      <p className="text-[9px]">Renews in 5 days.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">₹2.99</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-destructive" />
                <span className="text-xs font-bold uppercase tracking-wide text-destructive">Budget Exceeded</span>
              </div>
               <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold">Entertainment</p>
                     <span className="text-[10px] text-destructive bg-destructive/10 px-1 rounded-sm">₹18 left</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-destructive h-full rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold">Transport</p>
                     <span className="text-[10px] text-accent bg-accent/10 px-1 rounded-sm">₹36 left</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Heatmap Grid replacing the old Line chart */}
          <ExpenseHeatmap transactions={summary.transactions} />

          {/* Table */}
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider">March 1 – March 31, 2026 📅</h2>
              <select className="bg-muted text-xs border border-border rounded-md px-3 py-1 outline-none">
                <option>All Categories</option>
              </select>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground h-10">
                    <th className="font-medium px-4 w-24">Date</th>
                    <th className="font-medium px-4">Merchant</th>
                    <th className="font-medium px-4">Category</th>
                    <th className="font-medium px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {summary.transactions.length > 0 ? summary.transactions.map((txn, index) => (
                    <tr key={txn.id || index} className="border-b border-border/50 hover:bg-muted/50 transition-colors h-14">
                      <td className="px-4 font-medium">{new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</td>
                      <td className="px-4 font-bold flex items-center gap-2 mt-4">{txn.name}</td>
                      <td className="px-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${(() => {
                           const cat = txn.category || 'Other';
                           switch(cat) {
                             case 'Food': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
                             case 'Transport': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
                             case 'Fun': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
                             case 'Education': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
                             default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                           }
                        })()}`}>
                          {txn.category || 'Other'}
                        </span>
                      </td>
                      <td className={`px-4 text-right font-bold ${txn.type === 'income' ? 'text-accent' : 'text-foreground'}`}>
                        {txn.type === 'income' ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(2)}
                      </td>
                    </tr>
                  )) : (
                    <tr className="border-b border-border/50 h-14">
                      <td colSpan="4" className="px-4 text-center text-muted-foreground">No recent transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* 4 Stacked Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <ArrowDown size={14} className="text-accent" /> Income
              </div>
              <h3 className="text-2xl font-bold mb-2">₹{summary.totalIncome.toLocaleString()}</h3>
              <div className="text-[10px] font-bold text-green-500 bg-green-500/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↑ 2% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <ArrowUp size={14} className="text-destructive" /> Expense
              </div>
              <h3 className="text-2xl font-bold mb-2">₹{summary.totalExpenses.toLocaleString()}</h3>
              <div className="text-[10px] font-bold text-destructive bg-destructive/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↓ 4% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <TrendingUp size={14} className="text-blue-500" /> Savings Ratio
              </div>
              <h3 className="text-2xl font-bold mb-2">{summary.totalIncome > 0 ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(0) : 0}%</h3>
              <div className="text-[10px] font-bold text-green-500 bg-green-500/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↑ 4% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <Wallet size={14} className="text-purple-500" /> Remaining
              </div>
              <h3 className="text-2xl font-bold mb-2">₹{summary.netBalance.toLocaleString()}</h3>
              <div className="text-[9px] text-muted-foreground">Safe until next payday</div>
            </div>
          </div>

          {/* Spending Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="mb-6 flex justify-between items-center border-b border-border pb-4">
               <h2 className="text-sm font-bold uppercase tracking-wider">Spending Breakdown</h2>
               <ArrowUp size={14} className="text-muted-foreground" />
            </div>

            <div className="space-y-5">
              {categories.length > 0 ? (() => {
                const totalCategorySum = categories.reduce((sum, cat) => sum + cat.value, 0);
                
                // Fixed universal UI colors so they match the Expense bubbles universally
                const getCategoryColor = (label) => {
                  switch(label) {
                    case 'Food': return 'bg-orange-500';
                    case 'Transport': return 'bg-blue-500';
                    case 'Fun': return 'bg-purple-500';
                    case 'Education': return 'bg-green-500';
                    case 'Housing': return 'bg-emerald-500';
                    case 'Shopping': return 'bg-pink-500';
                    case 'Subscriptions': return 'bg-teal-500';
                    default: return 'bg-gray-400'; // Other and fallbacks
                  }
                };

                return categories.map((cat, i) => {
                  const percentage = totalCategorySum > 0 ? (cat.value / totalCategorySum) * 100 : 0;
                  return (
                    <div key={cat.label}>
                      <div className="flex justify-between items-center mb-1 text-xs font-bold">
                        <span>{cat.label}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mb-2">₹{cat.value.toFixed(2)}</div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`${getCategoryColor(cat.label)} h-full rounded-full`} style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}></div>
                      </div>
                    </div>
                  );
                });
              })() : (
                <div className="text-center text-muted-foreground text-sm py-4">No spending data available.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}