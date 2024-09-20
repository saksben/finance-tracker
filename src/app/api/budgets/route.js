// Send GET response to backend
export async function GET() {
  const response = await fetch("http://localhost:3001/api/budgets", {
    method: "GET",
  });
  const budgets = await response.json();
  return new Response(JSON.stringify(budgets), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Send POST request to backend
export async function POST(req) {
  try {
    console.log("Processing POST request");
    const budgetData = await req.json();
    console.log('Received budget data:', budgetData)
    const response = await fetch("http://localhost:3001/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });
    if (!response.ok) {
      console.error('Failed to add budget:', response.statusText)
      return new Response(JSON.stringify({ message: "Error adding budget" }), {
        status: response.status,
      });
    }
    const data = await response.json();
    console.log('Budget added successfully:', data)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error during POST request:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
