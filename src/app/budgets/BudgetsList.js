"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  budgetRemoved,
  loadBudgets,
  selectBudget,
} from "../../lib/features/budget/budgetSlice";
import React from "react";
import { selectTransaction } from "../../lib/features/transactions/transactionsSlice";

// BudgetsList component to display all budgets from state
export function BudgetsList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudget);
  const transactions = useSelector(selectTransaction);

  React.useEffect(() => {
    // Load budgets with transactions when the component mounts
    dispatch(loadBudgets({ budgets, transactions }));
  }, [dispatch]); // Says it's missing dependencies, but using useCallback and playing with dependencies either gives same warning or infinite loop error

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
      dispatch(
        budgetRemoved({
          id: budget.id,
        })
      );
    };

    return (
      // Return a single budget with edit and delete buttons
      <article key={budget.id} className="flex gap-2">
        {budget.overbudget && (
          <span className="bg-orange-500 text-black">Overbudget!</span>
        )}
        <a href={`/budgets/details/${budget.id}`}>
          <span className="flex gap-2">
            <p>{budget.name}</p>
          </span>
        </a>
        <button onClick={handleEdit} className="bg-slate-700">
          Edit
        </button>
        <button onClick={handleDelete} className="bg-red-600">
          Delete
        </button>
      </article>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <h2>Budgets</h2>
      <button className="bg-sky-500" onClick={handleAdd}>
        Add a Budget
      </button>
      {renderedBudgets}
    </div>
  );
}
