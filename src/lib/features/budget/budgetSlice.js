import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = [
  {
    id: "1",
    name: "Personal Account",
    estimatedRevenue: 2000,
    categories: [
      { id: "1", name: "Food", estimate: 50 },
      { id: "2", name: "Rent", estimate: 1500 },
    ],
    users: [
      { id: "1", name: "Me", estimate: 300 },
      { id: "2", name: "Dad", estimate: 450 },
    ],
    alertOverbudget: true,
    alertOverAmount: true,
    alertAmount: 1000,
    overbudget: false,
  },
  {
    id: "2",
    name: "Joint Account",
    estimatedRevenue: 3870,
    categories: [{ id: "3", name: "Budget", estimate: 3870 }],
    users: [
      { id: "1", name: "Me", estimate: 1333 },
      { id: "2", name: "Jonathan", estimate: 1204 },
      { id: "3", name: "Dad", estimate: 1333 },
    ],
    alertOverbudget: false,
    alertOverAmount: false,
    overbudget: false,
  },
];

// Calculates whether budget is overbudget, to store and share with entire app
const calculateOverbudget = (budget, transactions = []) => {
  const totalCategoriesEstimate = budget.categories.reduce(
    (total, category) => total + category.estimate,
    0
  );

  const expensesTotalActual = transactions.reduce((total, transaction) => {
    if (
      budget.categories.some(
        (category) => category.name === transaction.category
      )
    ) {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  const overUnderEst = expensesTotalActual - totalCategoriesEstimate;

  return budget.alertOverbudget && overUnderEst > 0;
};

// Redux slice pertaining to budgets
export const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    // Action to add a budget to state
    budgetAdd(state, action) {
      state.push(action.payload);
    },
    // Action to edit a budget in state
    budgetEdited(state, action) {
      const {
        id,
        name,
        estimatedRevenue,
        categories,
        users,
        transactions = [],
      } = action.payload;
      const foundBudget = state.find((budget) => budget.id === id);
      if (foundBudget) {
        foundBudget.name = name;
        foundBudget.estimatedRevenue = estimatedRevenue;
        foundBudget.categories = categories;
        foundBudget.users = users;
        foundBudget.overbudget = calculateOverbudget(foundBudget, transactions);
      }
    },
    // Action to remove a budget from state
    budgetRemoved(state, action) {
      const { id } = action.payload;
      return state.filter((budget) => budget.id !== id);
    },
    // Load initial budgets from the start so higher-level pages have access to budget alerts instead of needing to visit budget details first
    loadBudgets(state, action) {
      return action.payload.budgets.map((budget) => ({
        ...budget,
        overbudget: calculateOverbudget(budget, action.payload.transactions),
      }));
    },
  },
});

export const { budgetAdd, budgetEdited, budgetRemoved, loadBudgets } =
  budgetSlice.actions;

export const selectBudget = (state) => state.budgets;

export default budgetSlice.reducer;
