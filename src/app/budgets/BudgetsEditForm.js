"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { budgetEdited, updateBudget } from "../../lib/features/budget/budgetSlice";
import { fetchCategories, selectCategories, selectCategory } from "../../lib/features/transactions/categories/categorySlice";
import { fetchUsers, selectUser, selectUsers } from "../../lib/features/users/usersSlice";

// BudgetsEditForm component to edit budget
export function BudgetsEditForm({ budgetId }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Find this specific budget in state and select it for editing
  const budget = useSelector((state) =>
    state.budgets.budgets.find((budget) => budget.id === budgetId)
  );

  // Categories retrieved from Redux store
  const stateCategories = useSelector(selectCategories);
  const categoryStatus = useSelector((state) => state.categories.status)

  // Users retrieved from Redux store
  const stateUsers = useSelector(selectUsers);
  const userStatus = useSelector((state) => state.users.status)

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
  // Initial state for users select element, starting with all store users except for those selected by the budget
  const [users, setUsers] = React.useState(
    stateUsers.filter(
      (user) =>
        !budget.users.find((selectedUser) => selectedUser.id === user.id)
    )
  );
  // Initial state for the user-selected
  const [selectedUsers, setSelectedUsers] = React.useState(budget.users);
  // Initial states for alerts
  const [overbudgetAlert, setOverBudgetAlert] = React.useState(
    budget.alertOverbudget
  );
  const [alertOverAmount, setAlertOverAmount] = React.useState(
    budget.alertOverAmount
  );
  const [alertAmount, setAlertAmount] = React.useState(budget.alertAmount);

  React.useEffect(() => {
    if (categoryStatus === "idle") {
      dispatch(fetchCategories());
    }

    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [categoryStatus, userStatus, dispatch]);

  React.useEffect(() => {
    if (categoryStatus === "succeeded") {
      setCategories(stateCategories);
    }
    if (userStatus === "succeeded") {
      setUsers(stateUsers);
    }
  }, [stateCategories, categoryStatus, stateUsers, userStatus]);


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
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEstRevChange = (e) => {
    setEstRev(e.target.value);
  };
  // Toggle overbudget alert
  const handleOverbudgetChange = (e) => {
    e.preventDefault()
    setOverBudgetAlert(!overbudgetAlert);
  };
  // toggle alert for if budget is over a specified amount
  const handleAlertOverAmountChange = (e) => {
    e.preventDefault()
    setAlertOverAmount(!alertOverAmount);
  };
  const handleAlertAmountChange = (e) => {
    setAlertAmount(e.target.value);
  };
  // When a user clicks a category, add the category to the user-selected list and remove it from available options
  const handleCategoryChange = (e) => {
    const selectedCategoryId = parseInt(e.target.value);
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );

    if (selectedCategory) {
      setSelectedCategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        { ...selectedCategory, estimate: 0 },
      ]);
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== selectedCategoryId)
      );
    }
  };
  // When a user clicks a user, add the user to the user-selected list and remove it from available options
  const handleUsersChange = (e) => {
    const selectedUserId = parseInt(e.target.value);
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

  // An estimable budget item when selected by user to include in budget calculations
  const renderedItem = selectedCategories.map((cat) => {
    return (
      <span
        key={cat.id}
        className="flex items-center justify-center gap-2 mb-2"
      >
        <p>{cat.name}</p>
        <label htmlFor="budgetEstimatedExpense">
          Estimate:
          <input
            type="number"
            id="budgetEstimatedExpense"
            name="budgetEstimatedExpense"
            value={cat.estimate}
            onChange={(e) => handleEstimate(cat.id, e.target.value)}
            className="ml-2 px-2"
          />
        </label>
        <button
          onClick={() => handleCatDelete(cat.id)}
          className="bg-red-600 py-1 px-2 rounded"
        >
          Delete
        </button>
      </span>
    );
  });

  // A user rendered when selected by user to include in budget calculation, who has an estimable budget contribution amount
  const renderedUser = selectedUsers.map((user) => {
    return (
      <span
        key={user.id}
        className="flex items-center justify-center gap-2 mb-2"
      >
        <p>{user.name}</p>
        <label htmlFor="budgetUserEstimation">
          Estimated contribution:
          <input
            type="number"
            id="budgetUserEstimation"
            name="budgetUserEstimation"
            value={user.estimate}
            onChange={(e) => handleUserEstimate(user.id, e.target.value)}
            className="ml-2 px-2"
          />
        </label>
        <button
          onClick={() => handleUserDelete(user.id)}
          className="bg-red-600 py-1 px-2 rounded"
        >
          Delete
        </button>
      </span>
    );
  });

  // On click, update budget in state and return to budgets page
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(
      updateBudget({
        id: budgetId,
        name: name,
        estimatedRevenue: parseInt(estRev),
        categories: selectedCategories.map(cat => ({
          id: cat.id,
          estimate: parseInt(cat.estimate)
        })),
        users: selectedUsers.map(user => ({
          id: user.id,
          estimate: parseInt(user.estimate)
        })),
        alertOverbudget: overbudgetAlert,
        alertOverAmount: alertOverAmount,
        alertAmount: parseInt(alertAmount),
        overbudget: overbudgetAlert
      })
    );
    router.push("/budgets");
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-2 items-center mt-3 w-11/12">
        <form className="flex flex-col gap-2">
          <h2 className="text-center">Edit Budget</h2>
          <article className="flex flex-col gap-2 border p-5 my-5 rounded items-center justify-center">
            <p>Alerts: Click to...</p>
            <span>
              <button
                className="bg-sky-500 py-1 px-2 rounded"
                onClick={handleOverbudgetChange}
              >
                {overbudgetAlert && <span>NOT </span>}
                Alert Me When Overbudget
              </button>
            </span>
            <span>
              <button
                className="bg-sky-500 py-1 px-2 rounded mr-2"
                onClick={handleAlertOverAmountChange}
              >
                {alertOverAmount && <span>NOT </span>}
                Alert Me When Over...
              </button>
              <label htmlFor="alertAmount">
                <input
                  type="number"
                  id="alertAmount"
                  name="alertAmount"
                  value={alertAmount}
                  onChange={handleAlertAmountChange}
                  className="px-2 w-[100px]"
                />
              </label>
            </span>
          </article>
          {/* Budget name */}
          <label htmlFor="budgetName">
            Name
            <input
              id="budgetName"
              name="budgetName"
              value={name}
              onChange={handleNameChange}
              required
              className="ml-2 px-2"
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
              className="ml-2 px-2"
            />
          </label>
          {/* Budget categories */}
          <label htmlFor="budgetCategory">
            Categories
            <select
              id="budgetCategory"
              name="budgetCategory"
              onChange={handleCategoryChange}
              className="ml-2 px-2"
            >
              <option key="0" value="" hidden></option>
              {renderedStateCategories}
            </select>
          </label>
          <div>{renderedItem}</div>
          {/* Budget users */}
          <label htmlFor="budgetUsers">
            Users
            <select
              id="budgetUsers"
              name="budgetUsers"
              onChange={handleUsersChange}
              className="ml-2 px-2"
            >
              <option key="0" value="" hidden></option>
              {renderedStateUsers}
            </select>
          </label>
          <div>{renderedUser}</div>
          <button
            type="button"
            onClick={handleSave}
            className="bg-sky-500 py-1 px-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
