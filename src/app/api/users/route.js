import { NextResponse } from "next/server";

// Send GET request to the backend
export async function GET() {
  // const users = [{id: 1, name: 'John Doe'}, {id: 2, name: 'Jane Smith'}] // Hard coded db
  const response = await fetch("http://localhost:3001/api/users", {
    method: "GET",
  });
  const users = await response.json();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req) {
  const userData = await req.json();

  // Send POST request to the backend
  const response = await fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ message: "Error adding user" }), {
      status: response.status,
    });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}