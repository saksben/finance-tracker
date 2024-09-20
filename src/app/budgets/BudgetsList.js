"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  budgetRemoved,
  deleteBudget,
  fetchBudgets,
  loadBudgets,
  selectBudgets,
} from "../../lib/features/budget/budgetSlice";
import React from "react";
import { selectTransactions } from "../../lib/features/transactions/transactionsSlice";

// BudgetsList component to display all budgets from state
export function BudgetsList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);
  const budgetStatus = useSelector((state) => state.budgets.status);

  React.useEffect(() => {
    // Load budgets with transactions when the component mounts
    if (budgetStatus === "idle") {
      // dispatch(loadBudgets({ budgets, transactions }));
      dispatch(fetchBudgets());
    }
  }, [budgetStatus, dispatch]); // Says it's missing dependencies, but using useCallback and playing with dependencies either gives same warning or infinite loop error

  // On click, take to budget add form page
  const handleAdd = () => {
    router.push("/budgets/add");
  };

  // Create a budget for each one in state
  const renderedBudgets = budgets.map((budget) => {
    // On click, take to that budget's edit form page
    const handleEdit = () => {
      router.push(`/budgets/edit/${budget.id}`);
    };

    // On delete, remove that budget from state
    const handleDelete = () => {
      dispatch(deleteBudget(budget.id));
    };

    return (
      // Return a single budget with edit and delete buttons
      <article key={budget.id} className="flex gap-2 items-center mb-2">
        {budget.overbudget && (
          <span className="bg-orange-500 text-white flex items-center justify-center rounded p-1">
            Overbudget!
          </span>
        )}
        <a href={`/budgets/details/${budget.id}`}>
          <span className="flex gap-2 hover:underline">
            <p>{budget.name}</p>
          </span>
        </a>
        <button onClick={handleEdit} className="py-1 px-2 bg-slate-500 rounded">
          Edit
        </button>
        <button onClick={handleDelete} className="py-1 px-2 bg-red-600 rounded">
          Delete
        </button>
      </article>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-3">Budgets</h2>
      <button className="bg-sky-500 mb-5 py-1 px-2 rounded" onClick={handleAdd}>
        Add a Budget
      </button>
      <div className="flex flex-col items-center border p-2 rounded">
        {renderedBudgets}
      </div>
    </div>
  );
}
