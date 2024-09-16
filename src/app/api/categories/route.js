// Send GET request to backend
export async function GET() {
  const response = await fetch("http://localhost:3001/api/categories", {
    method: "GET",
  });
  const categories = await response.json();
  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Send POST request to backend
export async function POST(req) {
  const categoryData = await req.json();

  const response = await fetch("http://localhost:3001/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
