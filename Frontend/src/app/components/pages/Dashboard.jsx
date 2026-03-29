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
  const userName = user?.name || "Hazian";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 text-foreground pb-12 font-sans">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif italic mb-1">Good evening, {userName} </h1>
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
                ${summary.totalBalance > 0 ? summary.totalBalance.toFixed(0) : '1,260'}
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
                  <span className="text-xs font-bold">$10.99</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-[10px] font-bold">Drive Storage</p>
                      <p className="text-[9px]">Renews in 5 days.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">$2.99</span>
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
                     <span className="text-[10px] text-destructive bg-destructive/10 px-1 rounded-sm">$18 left</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="bg-destructive h-full rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold">Transport</p>
                     <span className="text-[10px] text-accent bg-accent/10 px-1 rounded-sm">$36 left</span>
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
                  {/* Real mocked entries matching user screenshot closely */}
                  <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors h-14">
                    <td className="px-4 font-medium">March 23</td>
                    <td className="px-4 font-bold flex items-center gap-2 mt-4"> Starbucks</td>
                    <td className="px-4"><span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-[10px] px-2 py-1 rounded-full font-bold">Dining</span></td>
                    <td className="px-4 text-right font-bold">-$6.40</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors h-14">
                    <td className="px-4 font-medium">March 23</td>
                    <td className="px-4 font-bold flex items-center gap-2 mt-4"> Uber</td>
                    <td className="px-4"><span className="bg-blue-500/20 text-blue-600 dark:text-blue-500 text-[10px] px-2 py-1 rounded-full font-bold">Transportation</span></td>
                    <td className="px-4 text-right font-bold">-$18.70</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors h-14">
                    <td className="px-4 font-medium">March 18</td>
                    <td className="px-4 font-bold flex items-center gap-2 mt-4">Amazon</td>
                    <td className="px-4"><span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-1 rounded-full font-bold">Shopping</span></td>
                    <td className="px-4 text-right font-bold">-$74.90</td>
                  </tr>
                  <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors h-14">
                    <td className="px-4 font-medium">March 14</td>
                    <td className="px-4 font-bold flex items-center gap-2 mt-4"> Netflix</td>
                    <td className="px-4"><span className="bg-green-500/20 text-green-600 dark:text-green-500 text-[10px] px-2 py-1 rounded-full font-bold">Subscriptions</span></td>
                    <td className="px-4 text-right font-bold">-$15.49</td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors h-14">
                    <td className="px-4 font-medium">March 06</td>
                    <td className="px-4 font-bold flex items-center gap-2 mt-4"> Whole Foods</td>
                    <td className="px-4"><span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-[10px] px-2 py-1 rounded-full font-bold">Groceries</span></td>
                    <td className="px-4 text-right font-bold">-$82.30</td>
                  </tr>
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
              <h3 className="text-2xl font-bold mb-2">$4,800</h3>
              <div className="text-[10px] font-bold text-green-500 bg-green-500/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↑ 2% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <ArrowUp size={14} className="text-destructive" /> Expense
              </div>
              <h3 className="text-2xl font-bold mb-2">$3,560</h3>
              <div className="text-[10px] font-bold text-destructive bg-destructive/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↓ 4% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <TrendingUp size={14} className="text-blue-500" /> Savings Ratio
              </div>
              <h3 className="text-2xl font-bold mb-2">26%</h3>
              <div className="text-[10px] font-bold text-green-500 bg-green-500/10 inline-flex items-center px-1.5 py-0.5 rounded-sm">
                ↑ 4% vs last month
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mb-3">
                <Wallet size={14} className="text-purple-500" /> Remaining
              </div>
              <h3 className="text-2xl font-bold mb-2">$1,240</h3>
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
              
              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Housing</span>
                  <span className="text-muted-foreground">39%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$1,650</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '39%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Food & Dining</span>
                  <span className="text-muted-foreground">18%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$780</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Transportation</span>
                  <span className="text-muted-foreground">13%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$540</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '13%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Entertainment</span>
                  <span className="text-muted-foreground">10%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$420</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Shopping</span>
                  <span className="text-muted-foreground">8%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$330</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs font-bold">
                  <span>Subscriptions</span>
                  <span className="text-muted-foreground">5%</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">$210</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}