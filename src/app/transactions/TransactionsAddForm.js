"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionAdded } from "../../lib/features/transactions/transactionsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { selectCategory } from "../../lib/features/transactions/categories/categorySlice";

// TransactionsAddForm component to add a transaction to the list
export function TransactionsAddForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useSelector(selectCategory);

  console.log(categories);

  // Format today's date as select element
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Input states
  const [date, setDate] = React.useState(`${year}-${month}-${day}`);
  const [amount, setAmount] = React.useState(0);
  const [description, setDescription] = React.useState("Transaction");
  const [type, setType] = React.useState("Expense");
  const [category, setCategory] = React.useState("Gasoline");

  // Input change handlers
  const handleDateChange = (e) => setDate(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);
  const handleCategoryChange = (e) => {
    // If user wants to add a category, go to Category page
    if (e.target.value === "add-category") {
      router.push("/transactions/category");
    } else {
      setCategory(e.target.value);
    }
  };

  // Categories from state
  const renderedCategories = categories.map((cat) => (
    <option key={cat.id}>{cat.name}</option>
  ));

  // Button submit handler, add transaction data to Redux store
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      transactionAdded({
        id: nanoid(),
        date,
        amount,
        description,
        type,
        category,
      })
    );
    setAmount(0), setDescription("");
  };

  return (
    <form className="flex flex-col gap-2 justify-center items-center border rounded p-3 pt-2 w-9/12">
      <h4>Add a Transaction</h4>
      <div className="flex gap-2 items-center">
        {/* Transaction date */}
        <label htmlFor="transactionDate">
          Date
          <input
            type="date"
            id="transactionDate"
            name="transactionDate"
            value={date}
            onChange={handleDateChange}
            required
          />
        </label>

        {/* Transaction type */}
        <label htmlFor="transactionType">
          Type
          <select
            required
            placeholder="Type"
            id="transactionType"
            name="transactionType"
            value={type}
            onChange={handleTypeChange}
          >
            <option>Expense</option>
            <option>Revenue</option>
          </select>
        </label>

        {/* Transaction amount */}
        <label htmlFor="transactionAmount">
          Amount
          <input
            type="number"
            id="transactionAmount"
            name="transactionAmount"
            value={amount}
            className="w-[100px]"
            onChange={handleAmountChange}
            required
          />
        </label>

        {/* Transaction description */}
        <label htmlFor="transactionDescription">
          Description
          <input
            type="text"
            id="transactionDescription"
            name="transactionDescription"
            value={description}
            onChange={handleDescriptionChange}
          />
        </label>

        {/* Transaction category */}
        <label htmlFor="transactionCategory">
          Category
          <select
            placeholder="Category"
            id="transactionCategory"
            name="transactionCategory"
            value={category}
            onChange={handleCategoryChange}
          >
            <option key="0" value="" hidden></option>
            <option key="1" value="add-category">+ Add Category</option>
            {renderedCategories}
          </select>
        </label>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="py-1 px-2 bg-sky-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
