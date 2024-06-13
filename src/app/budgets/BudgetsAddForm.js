"use client";

import { nanoid } from "@reduxjs/toolkit";
import { budgetAdd } from "../../lib/features/budget/budgetSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCategory } from "../../lib/features/transactions/categories/categorySlice";
import { selectUser } from "../../lib/features/users/usersSlice";

// BudgetsAddForm component to add budgets
export function BudgetsAddForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Categories retrieved from Redux store
  const stateCategories = useSelector(selectCategory);

  // Users retrieved from Redux store
  const stateUsers = useSelector(selectUser);

  // Initial state
  const [name, setName] = React.useState("");
  const [estRev, setEstRev] = React.useState(0);
  // Initial state for the categories in Redux store
  const [categories, setCategories] = React.useState(stateCategories);
  // Initial state for the user-selected categories
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  // Initial state for the users in Redux store
  const [users, setUsers] = React.useState(stateUsers);
  // Initial state for the user-selected
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  // Make a category option for each category in store
  const renderedStateCategories = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  // Make a user option for each user in store
  const renderedStateUsers = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  // Change handlers
  const handleName = (e) => setName(e.target.value);
  const handleEstRev = (e) => setEstRev(e.target.value);
  // When a user clicks a category, add the category to the user-selected list and remove it from available options
  const handleCategory = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );

    if (selectedCategory) {
      setSelectedCategories([
        ...selectedCategories,
        { ...selectedCategory, estimate: 0 },
      ]),
        setCategories(
          categories.filter((cat) => cat.id !== selectedCategoryId)
        );
    }
  };

  // When a user clicks a user, add the user to the user-selected list and remove it from available options
  const handleUsers = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find((user) => user.id === selectedUserId);

    if (selectedUser) {
      setSelectedUsers([...selectedUsers, { ...selectedUser, estimate: 0 }]),
        setUsers(users.filter((user) => user.id !== selectedUserId));
    }
  };

  // On delete, remove category from selected categories and return it to available categories
  const handleCatDelete = (catId) => {
    const selectedCategory = selectedCategories.find((cat) => cat.id === catId);
    if (selectedCategory) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategories(
        selectedCategories.filter((cat) => cat.id !== catId)
      );
    }
  };

  // On delete, remove user from selected users and return it to available users
  const handleUserDelete = (userId) => {
    const selectedUser = selectedUsers.find((user) => user.id === userId);
    if (selectedUser) {
      setUsers([...users, selectedUser]);
      setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    }
  };

  // Handler for when user changes category estimate
  const handleEstimate = (catId, value) => {
    setSelectedCategories(
      selectedCategories.map((cat) =>
        cat.id === catId ? { ...cat, estimate: value } : cat
      )
    );
  };

  // Handler for when user changes user estimate
  const handleUserEstimate = (userId, value) => {
    setSelectedUsers(
      selectedUsers.map((user) =>
        user.id === userId ? { ...user, estimate: value } : user
      )
    );
  };

  // An estimable buget item when selected by user to include in budget calculations
  const renderedItem = selectedCategories.map((cat) => {
    return (
      <span key={cat.id} className="flex">
        <p>{cat.name}</p>
        <label htmlFor="budgetEstimatedExpense">
          Estimate:
          <input
            type="number"
            id="budgetEstimatedExpense"
            name="budgetEstimatedExpense"
            value={cat.estimate}
            onChange={(e) => handleEstimate(cat.id, e.target.value)}
          />
        </label>
        <button onClick={() => handleCatDelete(cat.id)} className="bg-red-600">
          Delete
        </button>
      </span>
    );
  });

  // A user rendered when selected by user to include in budget calculation, who has an estimable budget contribution amount
  const renderedUser = selectedUsers.map((user) => {
    return (
      <span key={user.id} className="flex">
        <p>{user.name}</p>
        <label htmlFor="budgetUserEstimation">
          Estimated contribution:
          <input
            type="number"
            id="budgetUserEstimation"
            name="budgetUserEstimation"
            value={user.estimate}
            onChange={(e) => handleUserEstimate(user.id, e.target.value)}
          />
        </label>
        <button
          onClick={() => handleUserDelete(user.id)}
          className="bg-red-600"
        >
          Delete
        </button>
      </span>
    );
  });

  // On submit, add new budget to store and return to budgets page
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      budgetAdd({
        id: nanoid(),
        name: name,
        estimatedRevenue: estRev,
        categories: selectedCategories,
        users: selectedUsers,
      })
    );
    router.push("/budgets");
  };

  return (
    <>
      {/* Budget add form */}
      <form className="flex flex-col">
        <h2>Add a Budget</h2>
        {/* Budget name */}
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
        {/* Budget estimated revenue */}
        <label htmlFor="budgetEstimatedRevenue">
          Expected Revenue
          <input
            id="budgetEstimatedRevenue"
            name="budgetEstimatedRevenue"
            value={estRev}
            onChange={handleEstRev}
            required
          />
        </label>
        {/* Budget categories */}
        <label htmlFor="budgetCategory">
          Categories
          <select
            id="budgetCategory"
            name="budgetCategory"
            onChange={handleCategory}
          >
            <option key="0" value="" hidden></option>
            {renderedStateCategories}
          </select>
        </label>
        <div>{renderedItem}</div>
        {/* Budget users */}
        <label htmlFor="budgetUsers">
          Users
          <select id="budgetUsers" name="budgetUsers" onChange={handleUsers}>
            <option key="0" value="" hidden></option>
            {renderedStateUsers}
          </select>
        </label>
        <div>{renderedUser}</div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-sky-500 w-[60px]"
        >
          Submit
        </button>
      </form>
    </>
  );
}
