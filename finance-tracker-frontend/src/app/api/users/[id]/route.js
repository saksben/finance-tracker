import { NextResponse } from "next/server";

// Send GET request to the backend (findOne)
export async function GET(req, { params }) {
  const { id } = params;

  const response = await fetch(`http://localhost:3001/api/users/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }
  const user = await response.json();
  return NextResponse.json(user);
}

// Send PUT request to the backend
export async function PUT(req, { params }) {
  const { id } = params;
  const { name } = await req.json();

  try {
    // Forward request to backend service
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to update user" },
        { status: response.status }
      );
    }

    const updatedUser = await response.json();
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Send DELETE request to the backend
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user with ID: ${id}`);
    }
    return NextResponse.json({
      message: `User with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
