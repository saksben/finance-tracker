"use client";

import { useParams } from "next/navigation";
import { TransactionsEditForm } from "../../TransactionsEditForm";

// Page for editing the transaction by its id
export default function EditTransaction() {
  // Get the transaction's id from the url params and pass it to the edit form to specify the transaction
  const params = useParams();
  const id = parseInt(params.id);

  return id ? (
    <TransactionsEditForm transactionId={id} />
  ) : (
    <p>Transaction Not Found</p>
  );
}
