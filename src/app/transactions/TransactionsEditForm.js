"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionById,
  updateTransaction,
} from "../../lib/features/transactions/transactionsSlice";
import { selectCategories } from "../../lib/features/transactions/categories/categorySlice";
import { useRouter } from "next/navigation";
import { selectUsers } from "../../lib/features/users/usersSlice";

// TransactionsEdit component to edit transactions
export function TransactionsEditForm({ transactionId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useSelector(selectCategories);
  const users = useSelector(selectUsers);

  // Get the specific transaction from state by its id
  const transaction = useSelector((state) => {
    return state.transactions.transactions.find(
      (transaction) => transaction.id === transactionId
    );
  });
  const transactionStatus = useSelector((state) => state.transactions.status);

  // Format the transaction's date to human readable
  const year = transaction.date.slice(0, 4);
  const month = transaction.date.slice(5, 7);
  const day = transaction.date.slice(8, 10);

  // Input states
  const [date, setDate] = React.useState(`${year}-${month}-${day}`);
  const [user, setUser] = React.useState(transaction.user?.id);
  const [amount, setAmount] = React.useState(transaction.amount);
  const [description, setDescription] = React.useState(transaction.description);
  const [type, setType] = React.useState(transaction.type);
  const [category, setCategory] = React.useState(transaction.category.id);

  React.useEffect(() => {
    if (
      transactionStatus === "idle" ||
      (!transaction && transactionStatus !== "loading")
    ) {
      dispatch(fetchTransactionById(transactionId));
    } else if (transaction) {
      setDate(`${year}-${month}-${day}`);
      setUser(transaction.user.id);
      setAmount(transaction.amount);
      setDescription(transaction.description);
      setType(transaction.type);
      setCategory(transaction.category.id);
    }
  }, [dispatch, transactionId, transaction, transactionStatus]);

  // Input change handlers
  const handleDateChange = (e) => setDate(e.target.value);
  const handleUserChange = (e) => setUser(parseInt(e.target.value));
  const handleAmountChange = (e) => setAmount(parseFloat(e.target.value));
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);
  const handleCategoryChange = (e) => {
    // If user wants to add a category, go to Category page
    if (e.target.value === "add-category") {
      router.push("/transactions/category");
    } else {
      setCategory(parseInt(e.target.value));
    }
  };

  // Categories from state
  const renderedCategories = categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ));

  // Users from state
  const renderedUsers = users.map((user) => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ));

  // On save, update this transaction in state and go back to transactions page
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log(type)
      await dispatch(
        updateTransaction({
          id: transactionId,
          date,
          user,
          amount,
          description,
          type,
          category,
        })
      ).unwrap();
      router.push("/transactions");
    } catch (error) {
      console.error("Error updating transaction:", transaction);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="my-5">Edit Transaction</h4>
      <form className="flex flex-col lg:flex-row gap-1 lg:items-center justify-center w-11/12">
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
            className="ml-1"
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
            className="ml-1"
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
            className="ml-1"
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
            className="w-[100px] px-2 ml-1"
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
            className="px-2 ml-1"
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
            className="ml-1"
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
          className="py-1 px-2 bg-sky-500 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
