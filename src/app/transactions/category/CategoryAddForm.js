"use client";

import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../../lib/features/transactions/categories/categorySlice";

// CategoryAddForm component to add a category to state
export function CategoryAddForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [name, setName] = React.useState("");

  // Update input with value
  const handleChange = (e) => {
    setName(e.target.value);
  };

  // On submit, add category to state
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      dispatch(addCategory({name}))
    }
    router.push("/transactions");
  };

  // Take user back to the Transactions page
  const handleBack = (e) => {
    e.preventDefault();
    router.push("/transactions");
  };

  return (
    <form className='flex gap-2 p-10 items-center'>
      <label htmlFor="cat">
        Add a Category
        <input
          type="text"
          id="cat"
          name="cat"
          value={name}
          onChange={handleChange}
          className="sm:ml-2"
        />
      </label>
      <button onClick={handleSubmit} className="py-1 px-2 rounded bg-sky-500">Submit</button>
      <button onClick={handleBack} className="py-1 px-2 bg-slate-500 rounded">Back</button>
    </form>
  );
}
