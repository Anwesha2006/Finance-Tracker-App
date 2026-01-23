import transactions from "@/data/transactions.json"
import { ChatOpenAI } from "@langchain/openai"

// Add CORS headers to all responses
function addCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return addCorsHeaders(new Response(null, { status: 200 }))
}

export async function POST(req) {
  try {
    // Parse request body with validation
    let body;
    try {
      const text = await req.text()
      if (!text || text.trim() === '') {
        return addCorsHeaders(Response.json({ 
          error: 'Request body is empty' 
        }, { status: 400 }))
      }
      body = JSON.parse(text)
    } catch (error) {
      return addCorsHeaders(Response.json({ 
        error: 'Invalid JSON in request body',
        details: error.message 
      }, { status: 400 }))
    }

    const { question } = body

    // Validate question parameter
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return addCorsHeaders(Response.json({ 
        error: 'Question parameter is required and must be a non-empty string' 
      }, { status: 400 }))
    }

    // Process transactions to generate insights
    const expenses = transactions.filter(t => t.type === 'expense')
    const income = transactions.filter(t => t.type === 'income')
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
    
    // Analyze question and generate appropriate response
    const questionLower = question.toLowerCase()
    
    let response = {}
    
    if (questionLower.includes('wallet balance') || questionLower.includes('total balance') || questionLower.includes('current balance')) {
      response = {
        insight: `Your current wallet balance is ₹${totalIncome - totalExpenses}. This is calculated from your total income of ₹${totalIncome} minus your total expenses of ₹${totalExpenses}.`,
        chartType: "bar",
        data: [
          { label: "Total Income", value: totalIncome },
          { label: "Total Expenses", value: totalExpenses },
          { label: "Current Balance", value: totalIncome - totalExpenses }
        ]
      }
    } else if (questionLower.includes('expense') || questionLower.includes('spending')) {
      // Group expenses by category/name and get top ones
      const expenseGroups = {}
      expenses.forEach(t => {
        const category = t.name.includes('Bill') ? 'Bills' :
                        t.name.includes('Grocery') || t.name.includes('Food') ? 'Food' :
                        t.name.includes('Restaurant') || t.name.includes('Dining') ? 'Dining' :
                        t.name.includes('Transport') || t.name.includes('Taxi') || t.name.includes('Uber') ? 'Transport' :
                        'Other'
        expenseGroups[category] = (expenseGroups[category] || 0) + Math.abs(t.amount)
      })
      const model = new ChatOpenAI({
  apiKey: process.env.THESYS_API_KEY,
  model: "thesys-c1",
  configuration: {
    baseURL: "https://api.thesys.dev/v1/embed" // example – use exact URL from Thesys docs
  },
  temperature: 0.2
})

      const topExpenses = Object.entries(expenseGroups)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }))
      
      response = {
        insight: `Your top expense categories are: ${topExpenses.map(e => `${e.label} (₹${e.value})`).join(', ')}. Total expenses: ₹${totalExpenses}`,
        chartType: "pie",
        data: topExpenses
      }
    } else if (questionLower.includes('income')) {
      const incomeData = income.map(t => ({ 
        label: t.name, 
        value: t.amount 
      })).sort((a, b) => b.value - a.value).slice(0, 5)
      
      response = {
        insight: `Your total income is ₹${totalIncome}. Main sources: ${incomeData.map(i => i.label).join(', ')}`,
        chartType: "bar",
        data: incomeData
      }
    } else if (questionLower.includes('balance') || questionLower.includes('summary')) {
      response = {
        insight: `Financial Summary: Income ₹${totalIncome}, Expenses ₹${totalExpenses}, Net: ₹${totalIncome - totalExpenses}`,
        chartType: "bar",
        data: [
          { label: "Income", value: totalIncome },
          { label: "Expenses", value: totalExpenses },
          { label: "Net Balance", value: totalIncome - totalExpenses }
        ]
      }
    } else {
      // Default response with recent transactions
      const recentTransactions = transactions
        .slice(0, 5)
        .map(t => ({ 
          label: t.name, 
          value: Math.abs(t.amount) 
        }))
      
      response = {
        insight: `Here's an overview of your recent transactions. Total balance: ₹${totalIncome - totalExpenses}`,
        chartType: "timeline",
        data: recentTransactions
      }
    }

    return addCorsHeaders(Response.json(response))
  } catch (error) {
    console.error('API Error:', error)
    return addCorsHeaders(Response.json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 }))
  }
}

// Add GET method for testing
export async function GET() {
  return addCorsHeaders(Response.json({ 
    message: 'Financial API is running',
    usage: 'Send POST request with {"question": "your question"}',
    examples: [
      'What are my expenses?',
      'Show my income',
      'What is my balance?'
    ],
    status: 'healthy',
    timestamp: new Date().toISOString()
  }))
}
