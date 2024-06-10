"use client";

import { nanoid } from "@reduxjs/toolkit";
import { budgetAdd } from "../../lib/features/budget/budgetSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

// BudgetsAddForm component to add budgets
export function BudgetsAddForm() {
  const dispatch = useDispatch();
  const router = useRouter();

// Initial state
  const [name, setName] = React.useState("");
  const [estRev, setEstRev] = React.useState(0)

// Change handlers
  const handleName = (e) => setName(e.target.value);
  const handleEstRev = (e) => setEstRev(e.target.value)

// On submit, add new budget to state and return to budgets page
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      budgetAdd({
        id: nanoid(),
        name: name,
      })
    );
    router.push("/budgets");
  };

  return (
    <>
    {/* Budget add form */}
      <form className="flex flex-col">
        <h2>Add a Budget</h2>
        <label htmlFor="budgetName">
          Name
          <input
            id="budgetName"
            name="budgetName"
            value={name}
            onChange={handleName}
            required
          />
        </label>
        {/* <label htmlFor="budgetEstimatedRevenue">
          Expected Revenue
          <input
            id="budgetEstimatedRevenue"
            name="budgetEstimatedRevenue"
            value={estRev}
            onChange={handleEstRev}
            required
          />
        </label> */}
        <button type="button" onClick={handleSubmit} className="bg-sky-500 w-[60px]">
          Submit
        </button>
      </form>
    </>
  );
}
