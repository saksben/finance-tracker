"use client";

import { selectTransaction } from "../../lib/features/transactions/transactionsSlice";
import { useSelector } from "react-redux";

// TransactionsList component to display all transactions
export function TransactionsList() {
  // Select transactions from store
  const transactions = useSelector(selectTransaction);

  // Create a transaction for each one made
  const renderedTransactions = transactions.map((transaction) => (
    <article key={transaction.id}>
      <h3>{transaction.amount}</h3>
      <p>{transaction.description}</p>
    </article>
  ));

  return (
    <section>
      <h2>Transactions</h2>
      <span>{renderedTransactions}</span>
    </section>
  );
}
