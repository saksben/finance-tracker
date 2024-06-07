"use client";

import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { categoryAdded } from "../../../lib/features/transactions/categories/categorySlice";

// CategoryAddForm component to add a category to state
export function CategoryAddForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [cat, setCat] = React.useState("");

  // Update input with value
  const handleChange = (e) => {
    setCat(e.target.value);
  };

  // On submit, add category to state
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      categoryAdded({
        id: nanoid(),
        name: cat,
      })
    );
    router.push("/transactions");
  };

  // Take user back to the Transactions page
  const handleBack = (e) => {
    e.preventDefault();
    router.push("/transactions");
  };

  return (
    <form>
      <label htmlFor="cat">
        Add a Category
        <input
          type="text"
          id="cat"
          name="cat"
          value={cat}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleBack}>Back</button>
    </form>
  );
}
