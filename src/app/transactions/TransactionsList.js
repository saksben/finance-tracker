"use client";

import {
  selectTransaction,
  transactionRemoved,
  transactionEdited,
} from "../../lib/features/transactions/transactionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { TransactionsAddForm } from "./TransactionsAddForm";
import { useRouter } from "next/navigation";

// TODO: put in a table to organize and track inflows and outflows
// TODO: add date once for readability?
// TODO: add account functionality (use a TransactionsList component for each account)

// TransactionsList component to display all transactions
export function TransactionsList() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Select transactions from store
  const transactions = useSelector(selectTransaction);

  // Create a transaction for each one existing in state
  const renderedTransactions = transactions.map((transaction) => {
    // Format the transaction's date to human readable
    const year = transaction.date.slice(0, 4);
    const month = transaction.date.slice(5, 7);
    const day = transaction.date.slice(8, 10);

    // Edit button handler, edit transaction with this id from state
    const handleEdit = () => {
      router.push(`/transactions/edit/${transaction.id}`);
    };

    // Delete Button handler, delete transaction with this id from state
    const handleDelete = () => {
      dispatch(
        transactionRemoved({
          id: transaction.id,
        })
      );
    };

    return (
      // Return a single transaction row
      <article key={transaction.id} className="flex gap-4 items-center">
        <p>{`${month}-${day}-${year}`}</p>
        <p>{transaction.type}</p>
        <p>${transaction.amount}</p>
        <p>{transaction.description}</p>
        <p>{transaction.category}</p>
        <button className="py-1 px-2 bg-slate-600" onClick={handleEdit}>
          Edit
        </button>
        <button className="py-1 px-2 bg-red-600" onClick={handleDelete}>
          Delete
        </button>
      </article>
    );
  });

  return (
    <section className="flex flex-col items-center">
      <h2>Transactions</h2>
      <TransactionsAddForm />
      <span>{renderedTransactions}</span>
    </section>
  );
}
