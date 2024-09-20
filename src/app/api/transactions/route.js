// Send GET response to backend
export async function GET() {
  const response = await fetch("http://localhost:3001/api/transactions", {
    method: "GET",
  });
  const transactions = await response.json();
  return new Response(JSON.stringify(transactions), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Send POST request to backend
export async function POST(req) {
  const transactionData = await req.json();
  const response = await fetch(
    "http://localhost:3001/api/transactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    }
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ message: "Error adding transaction" }),
      {
        status: response.status,
      }
    );
  }
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
