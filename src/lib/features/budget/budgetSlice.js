import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = [
  {
    id: "1",
    name: "Personal Account",
    estimatedRevenue: 2000,
    categories: [{ id: "1", name: "Food", estimate: "200" }],
    users: [{ id: "1", name: "Me", estimate: "300" }],
  },
  {
    id: "2",
    name: "Joint Account",
    estimatedRevenue: 3000,
    categories: [{ id: "2", name: "Rent", estimate: "1200" }],
    users: [{ id: "1", name: "Me", estimate: "500" }],
  },
];

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
      const { id, name, estimatedRevenue, categories, users } = action.payload;
      const foundBudget = state.find((budget) => budget.id === id);
      if (foundBudget) {
        foundBudget.name = name;
        foundBudget.estimatedRevenue = estimatedRevenue;
        foundBudget.categories = categories;
        foundBudget.users = users;
      }
    },
    // Action to remove a budget from state
    budgetRemoved(state, action) {
      const { id } = action.payload;
      return state.filter((budget) => budget.id !== id);
    },
  },
});

export const { budgetAdd, budgetEdited, budgetRemoved } = budgetSlice.actions;

export const selectBudget = (state) => state.budgets;

export default budgetSlice.reducer;

// Each BudgetItem compares estimated to actual from state. Budget calculates total estimated expenses, total actual expenses, total estimated revenue, total actual revenue, total estimated profit, and total actual profit, then compares and alerts.
// Add EOM formula creation to budget. Get total deposits for each user (calculated, actual), totalRegular for each user (the user category estimate. add to User? A User variable set & passed per Account?), total expenses (calculated, actual), totalRegular (calculated total from all users estimates), total over/under paid (calculated: totalExpenses - totalRegular), total owed for each user (calculated: userOwed +- (totalOver/UnderPaid / numUsers)), stillOwed (calculated: totalExpenses - totalPaid), stillOwes per user (calculated: userOwes - userPaid)

// For each category, get the amount from every transaction with that category and sum it.