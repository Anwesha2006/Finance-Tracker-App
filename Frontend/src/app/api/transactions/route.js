import transactions from "@/data/transactions.json"

export async function GET() {
  try {
    return Response.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return Response.json({ 
      error: 'Failed to fetch transactions',
      details: error.message 
    }, { status: 500 })
  }
}