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

// Send POST request to the backend
export async function POST(req) {
  try {
    const userData = await req.json();
    const response = await fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          message: "Error adding user",
          details: errorData.details || errorData.message,
        }),
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An unexpected error occurred",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
