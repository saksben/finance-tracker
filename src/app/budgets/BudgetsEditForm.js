"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { budgetEdited } from "../../lib/features/budget/budgetSlice";
import { selectCategory } from "../../lib/features/transactions/categories/categorySlice";

// BudgetsEditForm component to edit budget
export function BudgetsEditForm({ budgetId }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Find this specific budget in state and select it for editing
  const budget = useSelector((state) =>
    state.budgets.find((budget) => budget.id === budgetId)
  );

  // Categories retrieved from Redux store
  const stateCategories = useSelector(selectCategory);

  // Initial state
  const [name, setName] = React.useState(budget.name);
  const [estRev, setEstRev] = React.useState(budget.estimatedRevenue);
  // Initial state for categories select element, starting with all store categories except for those selected by the budget
  const [categories, setCategories] = React.useState(
    stateCategories.filter(
      (category) =>
        !budget.categories.find(
          (selectedCategory) => selectedCategory.id === category.id
        )
    )
  );
  // Initial state for selected categories
  const [selectedCategories, setSelectedCategories] = React.useState(
    budget.categories
  );

  // Make a category option for each category in store
  const renderedStateCategories = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  // Change handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEstRevChange = (e) => {
    setEstRev(e.target.value);
  };
  // When a user clicks a category, add the category to the user-selected list and remove it from available options
  const handleCategoryChange = (e) => {
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

  // Handler for when user changes category estimate
  const handleEstimate = (catId, value) => {
    setSelectedCategories(
      selectedCategories.map((cat) =>
        cat.id === catId ? { ...cat, estimate: value } : cat
      )
    );
  };

  // An estimable budget item when selected by user to include in budget calculations
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

  // On click, update budget in state and return to budgets page
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      budgetEdited({
        id: budgetId,
        name: name,
        estimatedRevenue: estRev,
        categories: selectedCategories,
      })
    );
    router.push("/budgets");
  };

  return (
    <>
      <form>
        <h2>Edit Budget</h2>
        {/* Budget name */}
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
        {/* Budget estimated revenue */}
        <label htmlFor="budgetEstimatedRevenue">
          Expected Revenue
          <input
            id="budgetEstimatedRevenue"
            name="budgetEstimatedRevenue"
            value={estRev}
            onChange={handleEstRevChange}
            required
          />
        </label>
        {/* Budget categories */}
        <label htmlFor="budgetCategory">
          Categories
          <select
            id="budgetCategory"
            name="budgetCategory"
            onChange={handleCategoryChange}
          >
            <option key="0" value="" hidden></option>
            {renderedStateCategories}
          </select>
        </label>
        <div>{renderedItem}</div>
        <button
          type="button"
          onClick={handleSave}
          className="bg-sky-500 w-[60px]"
        >
          Save
        </button>
      </form>
    </>
  );
}
