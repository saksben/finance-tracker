import { createSlice } from "@reduxjs/toolkit";

// Get today's date for initial slice and format it as select element
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayDate = `${year}-${month}-${day}`;

// Initial state of transactions
const initialState = [
  {
    id: "1",
    date: todayDate,
    type: "Expense",
    amount: 30,
    description: "Wal-Mart",
    category: "Groceries",
  },
  {
    id: "2",
    date: todayDate,
    type: "Revenue",
    amount: 500,
    description: "Paycheck",
    category: "Job",
  },
];

// Redux slice pertaining to transactions
export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Action to add a transaction
    transactionAdded(state, action) {
      state.push(action.payload);
    },
    // Action to edit a transaction
    transactionEdited(state, action) {
      const { id, date, amount, description, type, category } = action.payload;
      const foundTransaction = state.find((transaction) => transaction.id === id);
      if (foundTransaction) {
        foundTransaction.date = date;
        foundTransaction.amount = amount;
        foundTransaction.description = description;
        foundTransaction.type = type;
        foundTransaction.category = category;
      }
    },
    // Action to remove a transaction
    transactionRemoved(state, action) {
        const {id} = action.payload
        return state.filter(transaction => transaction.id !== id)
    },
  },
});

export const { transactionAdded, transactionEdited, transactionRemoved } = transactionsSlice.actions;

export const selectTransaction = (state) => state.transactions;

export default transactionsSlice.reducer;
