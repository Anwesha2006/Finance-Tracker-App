'use client'

import { useState } from 'react'
import { Search, Plus, X } from 'lucide-react'

// Dummy historical data for filtering
const INITIAL_TRANSACTIONS = [
  { id: 1, name: 'Salary Deposit', amount: 3500, type: 'income', date: '2024-03-31', category: 'Salary', emoji: '💰' },
  { id: 2, name: 'Grocery Store', amount: -125.5, type: 'expense', date: '2024-03-31', category: 'Food', emoji: '🍔' },
  { id: 3, name: 'Electricity Bill', amount: -89.99, type: 'expense', date: '2024-03-30', category: 'Other', emoji: '⚡' },
  { id: 4, name: 'Uber Ride', amount: -18.70, type: 'expense', date: '2024-03-30', category: 'Transport', emoji: '🚌' },
  { id: 5, name: 'Restaurant', amount: -45.75, type: 'expense', date: '2024-03-29', category: 'Food', emoji: '🍔' },
  { id: 6, name: 'Gas Station', amount: -52.3, type: 'expense', date: '2024-03-28', category: 'Transport', emoji: '🚌' },
  { id: 7, name: 'Movie Tickets', amount: -30, type: 'expense', date: '2024-03-28', category: 'Fun', emoji: '🎮' },
  { id: 8, name: 'Bookstore', amount: -45, type: 'expense', date: '2024-03-27', category: 'Education', emoji: '📚' },
  { id: 9, name: 'Internet Bill', amount: -49.99, type: 'expense', date: '2024-03-26', category: 'Other', emoji: '🌐' },
  { id: 10, name: 'Gym Membership', amount: -50, type: 'expense', date: '2024-03-25', category: 'Other', emoji: '💪' },
];

export default function Expense() {
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Food');

  // Split Bill State
  const [splitAmount, setSplitAmount] = useState('1200');
  const [splitNote, setSplitNote] = useState('Dinner at Barbeque Nation');
  const [splitFriends, setSplitFriends] = useState([
    { id: '1', name: 'Priya', initial: 'P', colorClass: 'bg-purple-500/20 text-purple-400' },
    { id: '2', name: 'Rohan', initial: 'R', colorClass: 'bg-orange-500/20 text-orange-400' },
    { id: '3', name: 'Sneha', initial: 'S', colorClass: 'bg-blue-500/20 text-blue-400' },
  ]);

  // Derived Split Math Calculations (Equal Mode)
  const totalPeople = splitFriends.length + 1; // You + friends
  const parsedAmount = parseFloat(splitAmount) || 0;
  const amountPerPerson = totalPeople > 0 ? (parsedAmount / totalPeople) : 0;
  const youAreOwed = parsedAmount - amountPerPerson;

  const removeFriend = (id) => {
    setSplitFriends(splitFriends.filter(f => f.id !== id));
  };

  const addRandomFriend = () => {
    const newId = Date.now().toString();
    const colors = [
      'bg-red-500/20 text-red-400', 
      'bg-teal-500/20 text-teal-400', 
      'bg-pink-500/20 text-pink-400',
      'bg-yellow-500/20 text-yellow-400'
    ];
    setSplitFriends([
      ...splitFriends,
      {
        id: newId,
        name: 'Friend ' + (splitFriends.length + 1),
        initial: 'F',
        colorClass: colors[splitFriends.length % colors.length]
      }
    ]);
  };

  const categories = [
    { name: 'All', emoji: '' },
    { name: 'Food', emoji: '🍔' },
    { name: 'Transport', emoji: '🚌' },
    { name: 'Fun', emoji: '🎮' },
    { name: 'Education', emoji: '📚' },
    { name: 'Other', emoji: '📦' },
  ]

  const filteredTransactions = INITIAL_TRANSACTIONS.filter((txn) => {
    const matchesFilter = filter === 'All' || txn.category === filter
    const matchesSearch =
      txn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Mock Math for Budget
  const totalBudget = 12000;
  const spent = 4000;
  const remaining = totalBudget - spent;
  const percentage = (spent / totalBudget) * 100;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 text-foreground pb-24 font-sans selection:bg-accent/30">
      
      {/* HEADER DIV (Search & Stats in right corner) */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-bold font-serif italic mb-2">Expenses</h1>
           <p className="text-muted-foreground text-sm">Manage your budget, track expenses, and split bills seamlessly.</p>
        </div>
        
        <div className="w-full md:w-[400px] flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-transparent border border-border rounded-xl text-foreground outline-none focus:border-accent transition-colors text-sm"
            />
          </div>
          
          {/* Summary Stats Under Search with highlights */}
          <div className="flex justify-between items-center text-sm font-bold bg-card border border-border rounded-xl px-5 py-3 shadow-sm">
            <div>
              <span className="text-muted-foreground mr-2 text-xs uppercase tracking-wider">This month</span>
              <span className="text-accent bg-accent/10 px-2 py-1 rounded-md">₹3,703</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div>
              <span className="text-muted-foreground mr-2 text-xs uppercase tracking-wider">Avg/day</span>
              <span className="text-accent bg-accent/10 px-2 py-1 rounded-md">₹617</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        
        {/* LEFT COLUMN: Budget, Search, Filters, Stats & Transactions */}
        <div className="space-y-6">
          
          {/* MARCH BUDGET CARD */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md relative overflow-hidden mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">March budget</div>
                <div className="text-2xl font-bold">
                  ₹0 <span className="text-base font-normal text-muted-foreground">of ₹12,000</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-muted-foreground mb-1">remaining</div>
                <div className="text-2xl font-bold text-accent">₹8,000</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3 relative">
              <div className="absolute top-0 left-0 h-full bg-accent rounded-full" style={{ width: '0%' }}></div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
              <span>0% used — great start!</span>
              <span>11 days left</span>
            </div>
          </div>

          {/* FILTERS */}
          <div className="pt-2">
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {categories.map((cat) => (
                 <button 
                   key={cat.name}
                   onClick={() => setFilter(cat.name)}
                   className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${
                     filter === cat.name 
                     ? 'border-accent bg-accent/10 text-accent' 
                     : 'border-border text-foreground hover:bg-muted/50'
                   }`}
                 >
                   {cat.emoji && <span className="text-base">{cat.emoji}</span>}
                   {cat.name}
                 </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-card border border-border rounded-xl overflow-hidden mt-2 shadow-sm">
            <div className="grid md:grid-cols-5 p-4 bg-muted font-semibold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <div className="col-span-2">Transaction</div>
              <div>Category</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Type</div>
            </div>

            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="grid md:grid-cols-5 p-4 border-b border-border hover:bg-muted/50 transition-colors items-center text-sm last:border-0"
              >
                <div className="font-bold flex flex-col justify-center col-span-2 text-foreground">
                  <div className="flex items-center gap-2"><span className="text-xl">{txn.emoji}</span> {txn.name}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1 ml-7">{new Date(txn.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold bg-muted text-foreground px-2 py-1 rounded-md border border-border">
                    {txn.category}
                  </span>
                </div>
                <div
                  className={`text-right font-bold ${
                    txn.type === 'income' ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  {txn.type === 'income' ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(2)}
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold inline-block border ${
                      txn.type === 'income'
                        ? 'bg-accent/10 text-accent border-accent/20'
                        : 'bg-muted border-border text-foreground'
                    }`}
                  >
                    {txn.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No transactions match your search.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Add Expense & Split Bill */}
        <div className="space-y-6">
          
          {/* ADD EXPENSE WIDGET */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md transition-all">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-foreground">{isAdding ? 'New expense' : 'Add expense'}</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.slice(1).map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => { setSelectedCategory(cat.name); setIsAdding(true); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    selectedCategory === cat.name 
                    ? 'border-accent text-accent bg-accent/10' 
                    : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span> {cat.name}
                </button>
              ))}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border border-border text-muted-foreground hover:border-muted-foreground">
                + Other
              </button>
            </div>

            <div className="flex flex-col gap-4">
               <div className="w-full bg-background border border-border rounded-xl flex items-center px-4 h-14 focus-within:border-accent/50 transition-colors">
                 <span className="text-muted-foreground font-bold mr-3">₹</span>
                 <input 
                   type="number" 
                   placeholder={isAdding ? "Amount" : "0"} 
                   className="bg-transparent border-none outline-none text-xl w-full text-foreground placeholder:text-muted-foreground font-bold"
                   onFocus={() => setIsAdding(true)}
                 />
               </div>
               
               {isAdding && (
                 <div className="w-full bg-background border border-border rounded-xl flex items-center px-4 h-14 focus-within:border-accent/50 transition-colors">
                   <input 
                     type="text" 
                     placeholder="Note (optional)" 
                     className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground font-medium"
                   />
                 </div>
               )}

               {!isAdding ? (
                 <div className="flex justify-end mt-2">
                   <button className="bg-muted hover:bg-muted/80 text-foreground font-bold h-12 px-8 rounded-xl transition-colors border border-border">
                     Log
                   </button>
                 </div>
               ) : null}
            </div>
            
            {isAdding && (
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-accent hover:opacity-90 text-card font-bold h-12 rounded-xl transition-opacity">
                  Save
                </button>
                <button onClick={() => setIsAdding(false)} className="bg-background border border-border hover:bg-muted text-foreground font-bold h-12 px-8 rounded-xl transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* SPLIT BILL WIDGET */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md transition-all sticky top-6">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-foreground">Bill details</h2>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="w-full bg-background border border-border rounded-xl flex items-center px-4 h-14 focus-within:border-accent/50 transition-colors">
                 <span className="text-muted-foreground font-bold mr-3">₹</span>
                 <input 
                   type="number" 
                   value={splitAmount}
                   onChange={(e) => setSplitAmount(e.target.value)}
                   className="bg-transparent border-none outline-none text-xl w-full text-foreground font-bold" 
                 />
               </div>
               <div className="w-full bg-background border border-border rounded-xl flex items-center px-4 h-14 focus-within:border-accent/50 transition-colors">
                 <input 
                   type="text" 
                   value={splitNote}
                   onChange={(e) => setSplitNote(e.target.value)}
                   className="bg-transparent border-none outline-none text-sm w-full text-foreground font-bold" 
                 />
               </div>
            </div>

            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Split mode</h3>
            <div className="flex gap-3 mb-8">
              <button className="flex-1 h-12 rounded-xl border border-border text-foreground font-bold bg-muted text-xs">Equal</button>
              <button className="flex-[1.5] h-12 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Custom amounts</button>
              <button className="flex-1 h-12 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">By %</button>
            </div>

            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Who's splitting?</h3>
            <div className="space-y-4 mb-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center">Y</div>
                  <span className="font-bold flex items-center gap-2 text-foreground">You <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full uppercase">paid</span></span>
                </div>
                <div className="font-bold text-foreground">₹{amountPerPerson.toFixed(2)}</div>
              </div>
              
              {splitFriends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center ${friend.colorClass}`}>
                      {friend.initial}
                    </div>
                    <span className="font-bold text-foreground">{friend.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">₹{amountPerPerson.toFixed(2)}</span>
                    <button onClick={() => removeFriend(friend.id)}>
                      <X size={16} className="text-muted-foreground cursor-pointer hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
              
            </div>

            <button 
              onClick={addRandomFriend}
              className="w-full py-4 border border-border border-dashed rounded-xl text-muted-foreground font-bold hover:bg-muted transition-colors mb-6"
            >
              + Add person
            </button>

            {/* Dynamic Split Summary Footer */}
            <div className="bg-muted/50 rounded-xl p-5 border border-border">
               <h3 className="font-bold text-foreground mb-4">Summary</h3>
               
               <div className="space-y-3 pb-4 border-b border-border">
                 {splitFriends.map((friend) => (
                   <div key={`summary-${friend.id}`} className="flex justify-between text-sm">
                     <div className="flex gap-2 items-center text-foreground">
                       <div className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${friend.colorClass}`}>
                         {friend.initial}
                       </div> 
                       {friend.name} owes you
                     </div>
                     <div className="text-accent font-bold">₹{amountPerPerson.toFixed(2)}</div>
                   </div>
                 ))}
                 
                 {splitFriends.length === 0 && (
                   <div className="text-sm text-muted-foreground italic text-center py-2">
                     You are paying everything entirely by yourself! Ouch 😅
                   </div>
                 )}
               </div>
               
               <div className="pt-4 space-y-2">
                 <div className="flex justify-between text-sm text-muted-foreground font-medium">
                   <span>You paid</span> <span className="text-accent">₹{parsedAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm text-muted-foreground font-medium pb-4 border-b border-border">
                   <span>Your share</span> <span className="text-foreground">₹{amountPerPerson.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between font-bold pt-2 text-foreground">
                   <span>You are owed</span> <span className="text-accent">₹{Math.max(0, youAreOwed).toFixed(2)}</span>
                 </div>
               </div>
            </div>

            <div className="mt-8">
              <button className="w-full bg-accent hover:opacity-90 text-card font-bold h-12 rounded-xl transition-opacity">
                Confirm Split
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
