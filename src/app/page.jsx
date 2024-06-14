"use client";

import React from "react";
import { selectBudget, loadBudgets } from "../lib/features/budget/budgetSlice";
import { selectTransaction } from "../lib/features/transactions/transactionsSlice";
import { useDispatch, useSelector } from "react-redux";

// TODO: add multiple totals components so that you can have one for each account
// TODO: add account balance input
// TODO: add credit card and cash account types to accounts, and add equity formula, and bottom lines for each

// Dashboard page
export default function Home() {
  // Import transactions state
  const transactions = useSelector(selectTransaction);
  const budgets = useSelector(selectBudget)
  const dispatch = useDispatch()

  React.useEffect(() => {
    // Load budgets with transactions when the component mounts
    dispatch(loadBudgets({ budgets, transactions }));
  }, [dispatch]); // Says it's missing dependencies, but using useCallback and playing with dependencies either gives same warning or infinite loop error

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

  // If any budget is overbudget, flag overbudget alert
  let overbudget = false;
  for (let budget of budgets) {
    if (budget.overbudget) {
      overbudget = true
    }
  }

  return (
    <main className="flex flex-col items-center">
      <h2 className="my-5">Dashboard</h2>
      {overbudget && <span className="bg-orange-500 mb-5 text-black">Overbudget Alert!</span>}
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
