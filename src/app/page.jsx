"use client";

import { selectTransaction } from "../lib/features/transactions/transactionsSlice";
import { useSelector } from "react-redux";

// TODO: add multiple totals components so that you can have one for each account
// TODO: add account balance input
// TODO: add credit card and cash account types to accounts, and add equity formula, and bottom lines for each

// Dashboard page
export default function Home() {
  // Import transactions state
  const transactions = useSelector(selectTransaction);

  let totalRevenue = 0;
  let totalExpenses = 0;

  // Increment total income and total expenses
  for (let transaction of transactions) {
    if (transaction.type === "Revenue") {
      totalRevenue += Number(transaction.amount);
    } else if (transaction.type === "Expense") {
      totalExpenses += Number(transaction.amount);
    }
  }

  return (
    <main className="flex flex-col items-center">
      <h2 className="my-10">Dashboard</h2>
      <div className="flex flex-col justify-center items-center bg-orange-50 w-6/12 py-10">
        <h3 className="text-black">
          Revenue: <span className="text-green-500">${totalRevenue}</span>
        </h3>
        <h3 className="border-b border-black mb-10 text-black">
          Expenses: <span className="text-red-500">${totalExpenses}</span>
        </h3>
        <h3 className="text-black">
          Bottom Line:{" "}
          <span className="text-green-500">
            ${totalRevenue - totalExpenses}
          </span>
        </h3>
      </div>
    </main>
  );
}
