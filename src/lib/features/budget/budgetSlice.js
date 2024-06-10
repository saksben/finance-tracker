import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = [
    {id: "1", name: "Personal Account"},
    {id: "2", name: "Joint Account"},
];

// Redux slice pertaining to budgets
export const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    // Action to add a budget to state
    budgetAdd(state, action) {
        state.push(action.payload)
    },
    // Action to edit a budget in state
    budgetEdited(state, action) {
        const {id, name} = action.payload
        const foundBudget = state.find((budget) => budget.id === id)
        if (foundBudget) {
            foundBudget.name = name
        }
    },
    // Action to remove a budget from state
    budgetRemoved(state, action) {
        const {id} = action.payload
        return state.filter((budget) => budget.id !== id)
    }
  },
});

export const {budgetAdd, budgetEdited, budgetRemoved} = budgetSlice.actions

export const selectBudget = (state) => state.budgets

export default budgetSlice.reducer

// A budget is a list of estimated regular expenses assuming an estimated revenue, whose actual expenses are compared to actual revenue
// Add expenses categorized by category. Calculate estimated included expenses by category using select element of store categories (TagsInput). Compare estimated expenses to actual expenses, by category > alert if overbudget. Calculate if (totalRevenue > actualExpenses)

// Select categories to be included in budget from state. Each BudgetItem can be added/edited with an estimated expense budgetExpense ("How much do you expect to spend on this?"). Each BudgetItem compares estimated to actual from state. Budget calculates total estimated expenses, total actual expenses, total estimated revenue, total actual revenue, total estimated profit, and total actual profit, then compares and alerts.

// Add EOM formula creation to budget. Get total deposits for each user (calculated), totalRegular for each user (add to User? A User variable set & passed per Account?), total expenses (calculated), totalRegular (calculated total from all users), total over/under paid (calculated: totalExpenses - totalRegular), total owed for each user (calculated: userOwed +- (totalOver/UnderPaid / numUsers)), stillOwed (calculated: totalExpenses - totalPaid), stillOwes per user (calculated: userOwes - userPaid)

// Create an array. On select click, if the category doesn't already exist in the array, push that category to the array. For each category, get the amount from every transaction with that category and sum it.
// When selected, render each category into BudgetAddForm as a number input for estimated expense.