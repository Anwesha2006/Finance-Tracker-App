export async function POST(req) {
  try {
    const body = await req.json()
    return Response.json({ 
      message: "API is working", 
      received: body 
    })
  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({ message: "GET method works" })
}