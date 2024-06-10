"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { budgetEdited } from "../../lib/features/budget/budgetSlice";

// BudgetsEditForm component to edit budget
export function BudgetsEditForm({ budgetId }) {
  const dispatch = useDispatch();
  const router = useRouter();

// Find this specific budget in state and select it for editing
  const budget = useSelector((state) =>
    state.budgets.find((budget) => budget.id === budgetId)
  );

// Initial state
  const [name, setName] = React.useState(budget.name);

// Change handler
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

// On click, update budget in state and return to budgets page
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      budgetEdited({
        id: budgetId,
        name: name,
      })
    );
    router.push("/budgets");
  };

  return (
    <>
      <form>
        <h2>Edit Budget</h2>
        <label htmlFor="budgetName">
          Name
          <input
            id="budgetName"
            name="budgetName"
            value={name}
            onChange={handleNameChange}
            required
          />
        </label>
        <button type="button" onClick={handleSave} className="bg-sky-500">
          Submit
        </button>
      </form>
    </>
  );
}
