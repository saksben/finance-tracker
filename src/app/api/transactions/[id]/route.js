import { NextResponse } from "next/server";

// Send GET request to backend (findOne)
export async function GET(req, { params }) {
  const { id } = params;
  const response = await fetch(`http://localhost:3001/api/transactions/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    return new Response(JSON.stringify({ message: "Transaction not found" }), {
      status: 404,
    });
  }
  const transaction = await response.json();
  return NextResponse.json(transaction);
}

// Send PUT request to backend
export async function PUT(req, { params }) {
  const { id } = params;
  // const { name } = await req.json();
  const transactionData = await req.json();
  console.log("Updating transaction with ID:", id);
  console.log("transactionData:", transactionData);

  try {
    const response = await fetch(
      `http://localhost:3001/api/transactions/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json(); // Log the error response body
      console.error("Failed to update transaction:", errorData);
      return NextResponse.json(
        { message: "Failed to update the transaction", ...errorData },
        { status: response.status }
      );
    }

    const updatedTransaction = await response.json();
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Send DELETE request to backend
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const response = await fetch(
      `http://localhost:3001/api/transactions/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete transaction with ID: ${id}`);
    }
    return NextResponse.json({
      message: `Transaction with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
