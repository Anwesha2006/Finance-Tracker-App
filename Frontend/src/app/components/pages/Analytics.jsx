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

export default function Analytics() {
  const expenseByCategory = [
    { name: 'Groceries', value: 450, fill: '#00ff00' },
    { name: 'Utilities', value: 200, fill: '#4ade80' },
    { name: 'Transport', value: 300, fill: '#22c55e' },
    { name: 'Entertainment', value: 150, fill: '#16a34a' },
    { name: 'Other', value: 150, fill: '#15803d' },
  ]

  const monthlyTrend = [
    { month: 'Jan', income: 4000, expense: 2400 },
    { month: 'Feb', income: 3800, expense: 2210 },
    { month: 'Mar', income: 4200, expense: 2290 },
    { month: 'Apr', income: 3900, expense: 2000 },
    { month: 'May', income: 4300, expense: 2181 },
    { month: 'Jun', income: 4500, expense: 2500 },
  ]

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
        <Metric label="Average Monthly Income" value="₹4,117" accent />
        <Metric label="Average Monthly Expense" value="₹2,264" destructive />
        <Metric label="Average Savings Rate" value="45%" accent />
        <Metric label="Highest Expense" value="Groceries" />
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
