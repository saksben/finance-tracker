"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  selectTransactions,
  transactionAdded,
} from "../../lib/features/transactions/transactionsSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import {
  fetchCategories,
  selectCategories,
} from "../../lib/features/transactions/categories/categorySlice";
import { fetchUsers, selectUsers } from "../../lib/features/users/usersSlice";

// TransactionsAddForm component to add a transaction to the list
export function TransactionsAddForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useSelector(selectCategories);
  const categoryStatus = useSelector((state) => state.categories.status);
  const users = useSelector(selectUsers);
  const userStatus = useSelector((state) => state.users.status);

  // Format today's date as select element
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  // Input states
  const [date, setDate] = React.useState(`${year}-${month}-${day}`);
  const [user, setUser] = React.useState(1);
  const [amount, setAmount] = React.useState(0);
  const [description, setDescription] = React.useState("Transaction");
  const [type, setType] = React.useState("Expense");
  const [category, setCategory] = React.useState(1);

  // Input change handlers
  const handleDateChange = (e) => setDate(e.target.value);
  const handleUserChange = (e) => setUser(e.target.value);
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

  React.useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoryStatus, dispatch]);

  React.useEffect(() => {
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  // Categories from db
  const renderedCategories = categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ));

  // Users from db
  const renderedUsers = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  // Button submit handler, add transaction data to Redux store
  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = Number(user);
    const categoryId = Number(category);

    dispatch(
      addTransaction({
        date,
        user: userId,
        amount: Number(amount),
        description,
        type,
        category: categoryId,
      })
    );
    setAmount(0), setDescription("");
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center border rounded p-3 pt-2 w-10/12">
      <h4>Add a Transaction</h4>
      <form className="flex flex-col xl:flex-row gap-2 xl:items-center">
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
            className="ml-2 xl:ml-0 2xl:ml-2"
          />
        </label>

        {/* Transaction user */}
        <label htmlFor="transactionUser">
          User
          <select
            placeholder="User"
            id="transactionUser"
            name="transactionUser"
            value={user}
            onChange={handleUserChange}
            className="ml-2"
          >
            <option key="0" value=""></option>
            {renderedUsers}
          </select>
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
            className="ml-2"
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
            className="w-[100px] ml-2 px-2"
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
            className="ml-2 px-2"
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
            className="ml-2"
          >
            <option key="0" value="add-category">
              + Add Category
            </option>
            {renderedCategories}
          </select>
        </label>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="py-1 px-2 bg-sky-500 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
