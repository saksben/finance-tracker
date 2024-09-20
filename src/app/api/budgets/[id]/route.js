import { NextResponse } from "next/server";

// Send GET request to backend (findOne)
export async function GET(req, { params }) {
  const { id } = params;
  const response = await fetch(`http://localhost:3001/api/budgets/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    return new Response(JSON.stringify({ message: "Budget not found" }), {
      status: 404,
    });
  }
  const budget = await response.json();
  return NextResponse.json(budget);
}

// Send PUT request to backend
export async function PUT(req, { params }) {
  const { id } = params;
  const budgetData = await req.json();
  console.log("Updating budget with ID:", id);
  console.log("budgetData:", budgetData);
  try {
    const response = await fetch(`http://localhost:3001/api/budgets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update budget:", errorData);
      return NextResponse.json(
        { message: "Failed to update the budget:", errorData },
        { status: response.status }
      );
    }
    const updatedBudget = await response.json();
    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error("Error updating budget:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Send DELETE request to backend
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const response = await fetch(`http://localhost:3001/api/budgets/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete budget with ID: ${id}`);
    }
    return NextResponse.json({
      message: `Budget with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
