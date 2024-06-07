"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionEdited } from "../../lib/features/transactions/transactionsSlice";
import { selectCategory } from "../../lib/features/transactions/categories/categorySlice";
import { useRouter } from "next/navigation";
import { selectUser } from "../../lib/features/users/usersSlice";

// TransactionsEdit component to edit transactions
export function TransactionsEditForm({ transactionId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useSelector(selectCategory);
  const users = useSelector(selectUser);

  // Get the specific transaction from state by its id
  const transaction = useSelector((state) =>
    state.transactions.find((transaction) => transaction.id === transactionId)
  );

  // Input states
  const [date, setDate] = React.useState(transaction.date);
  const [user, setUser] = React.useState(transaction.user);
  const [amount, setAmount] = React.useState(transaction.amount);
  const [description, setDescription] = React.useState(transaction.description);
  const [type, setType] = React.useState(transaction.type);
  const [category, setCategory] = React.useState(transaction.category);

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

  // Categories from state
  const renderedCategories = categories.map((cat) => (
    <option key={cat.id}>{cat.name}</option>
  ));

  // Users from state
  const renderedUsers = users.map((user) => (
    <option key={user.id}>{user.name}</option>
  ));

  // On save, update this transaction in state and go back to transactions page
  const handleSave = () => {
    if (date) {
      dispatch(
        transactionEdited({
          id: transactionId,
          date,
          user,
          amount,
          description,
          type,
          category,
        })
      );
      router.push("/transactions");
    }
  };

  return (
    <div>
      <h4>Edit Transaction</h4>
      <form>
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

        {/* Transaction user */}
        <label htmlFor="transactionUser">
          User
          <select
            placeholder="User"
            id="transactionUser"
            name="transactionUser"
            value={user}
            onChange={handleUserChange}
          >
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
            <option key="1" value="add-category">
              + Add Category
            </option>
            {renderedCategories}
          </select>
        </label>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSave}
          className="py-1 px-2 bg-sky-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
