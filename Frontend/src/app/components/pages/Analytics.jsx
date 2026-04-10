'use client'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { useFinancial } from '../../context/FinancialContext'

export default function Analytics() {
  const { transactions, getExpenseCategories } = useFinancial();
  const rawCategories = getExpenseCategories();

  // Map backend categories to recharts format with matching colors
  const getHexColor = (label) => {
    switch(label) {
      case 'Food': return '#f97316';
      case 'Transport': return '#3b82f6';
      case 'Fun': return '#a855f7';
      case 'Education': return '#22c55e';
      case 'Housing': return '#10b981';
      case 'Shopping': return '#ec4899';
      case 'Subscriptions': return '#14b8a6';
      default: return '#9ca3af';
    }
  };

  const expenseByCategory = rawCategories.map(cat => ({
    name: cat.label,
    value: cat.value,
    fill: getHexColor(cat.label)
  })).filter(c => c.value > 0); // Only show categories on Pie Chart that have actual spending

  // Monthly trend mapped dynamically from transactions
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendMap = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const m = monthNames[d.getMonth()];
    if (!trendMap[m]) trendMap[m] = { month: m, income: 0, expense: 0, sort: d.getMonth() };
    if (t.type === 'income') trendMap[m].income += Math.abs(t.amount);
    else trendMap[m].expense += Math.abs(t.amount);
  });

  const monthlyTrend = Object.values(trendMap).map(m => ({
    ...m,
    income: m.income > 0 ? m.income : 20000 // Apply baseline 20k application context salary
  })).sort((a,b) => a.sort - b.sort);

  if (monthlyTrend.length === 0) {
    monthlyTrend.push({ month: monthNames[new Date().getMonth()], income: 20000, expense: 0, sort: new Date().getMonth() });
  }

  const avgMonthlyIncome = monthlyTrend.reduce((s, m) => s + m.income, 0) / monthlyTrend.length;
  const avgMonthlyExpense = monthlyTrend.reduce((s, m) => s + m.expense, 0) / monthlyTrend.length;
  const avgSavingsRate = avgMonthlyIncome > 0 ? (((avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome) * 100).toFixed(0) + '%' : '0%';
  const highestExpenseCat = rawCategories.length > 0 && rawCategories[0].value > 0 ? rawCategories[0].label : 'None';

  const savingsGoal = [
    { category: 'Emergency Fund', saved: 5000, goal: 10000 },
    { category: 'Vacation', saved: 1500, goal: 3000 },
    { category: 'Investment', saved: 2000, goal: 5000 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Visualize your spending patterns and financial trends.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ₹${value}`}
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Income vs Expenses (6 months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#00ff00" />
              <Bar dataKey="expense" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Spending Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#00ff00" />
            <Line type="monotone" dataKey="expense" stroke="#f43f5e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Savings Goals */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Savings Goals Progress</h2>

        {savingsGoal.map((goal, idx) => {
          const percent = Math.round((goal.saved / goal.goal) * 100)

          return (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <span>{goal.category}</span>
                <span className="text-sm text-muted-foreground">
                  ₹{goal.saved} / ₹{goal.goal}
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-accent h-3 rounded-full"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {percent}% complete
              </p>
            </div>
          )
        })}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric label="Average Monthly Income" value={`₹${avgMonthlyIncome.toFixed(0)}`} accent />
        <Metric label="Average Monthly Expense" value={`₹${avgMonthlyExpense.toFixed(0)}`} destructive />
        <Metric label="Average Savings Rate" value={avgSavingsRate} accent />
        <Metric label="Highest Expense" value={highestExpenseCat} />
      </div>
    </div>
  )
}

function Metric({ label, value, accent, destructive }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
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
