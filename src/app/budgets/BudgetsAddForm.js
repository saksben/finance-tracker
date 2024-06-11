"use client";

import { nanoid } from "@reduxjs/toolkit";
import { budgetAdd } from "../../lib/features/budget/budgetSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCategory } from "../../lib/features/transactions/categories/categorySlice";

// BudgetsAddForm component to add budgets
export function BudgetsAddForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Categories retrieved from Redux store
  const stateCategories = useSelector(selectCategory);

  // Initial state
  const [name, setName] = React.useState("");
  const [estRev, setEstRev] = React.useState(0);
  // Initial state for the categories in Redux store
  const [categories, setCategories] = React.useState(stateCategories);
  // Initial state for the user-selected categories
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  // Make a category option for each category in store
  const renderedStateCategories = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
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
      setSelectedCategories([...selectedCategories, { ...selectedCategory, estimate: 0 }]),
        setCategories(
          categories.filter((cat) => cat.id !== selectedCategoryId)
        );
    }
  };

  // On delete, remove category from selected categories and return it to available categories
  const handleCatDelete = (catId) => {
    const selectedCategory = selectedCategories.find((cat) => cat.id === catId);
    if (selectedCategory) {
      setCategories([...categories, selectedCategory]);
      setSelectedCategories(selectedCategories.filter((cat) => cat.id !== catId));
    }
  };

  // Handler for when user changes category estimate
  const handleEstimate = (catId, value) => {
    setSelectedCategories(
      selectedCategories.map((cat) => (cat.id === catId ? { ...cat, estimate: value } : cat))
    );
  };

  // An estimable buget item when selected by user to include in budget calculations
  const renderedItem = selectedCategories.map((cat) => {
    return (
      <span key={cat.id} className="flex">
        <p>{cat.name}</p>
        <label htmlFor="budgetEstimated expense">
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

  // On submit, add new budget to store and return to budgets page
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      budgetAdd({
        id: nanoid(),
        name: name,
        estimatedRevenue: estRev,
        categories: selectedCategories,
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
