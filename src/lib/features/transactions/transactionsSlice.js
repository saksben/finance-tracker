import { createSlice } from "@reduxjs/toolkit";

// Get today's date for initial slice and format it as select element
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayDate = `${year}-${month}-${day}`;

// Initial state of transactions
const initialState = [
  // {
  //   id: "1",
  //   date: todayDate,
  //   user: "Me",
  //   type: "Expense",
  //   amount: 30,
  //   description: "Wal-Mart",
  //   category: "Food",
  // },
  // {
  //   id: "2",
  //   date: todayDate,
  //   user: "Dad",
  //   type: "Revenue",
  //   amount: 500,
  //   description: "Paycheck",
  //   category: "Rent",
  // },
  // {
  //   id: "3",
  //   date: todayDate,
  //   user: "Me",
  //   type: "Expense",
  //   amount: 300,
  //   description: "Winco",
  //   category: "Food"
  // },
  {
    id: "1",
    date: todayDate,
    user: "Me",
    type: "Revenue",
    amount: 1065,
    description: "pymt",
    category: "Budget",
  },
  {
    id: "2",
    date: todayDate,
    user: "Jonathan",
    type: "Revenue",
    amount: 1204,
    description: "pymt",
    category: "Budget",
  },
  {
    id: "3",
    date: todayDate,
    user: "Dad",
    type: "Revenue",
    amount: 0,
    description: "pymt",
    category: "Budget",
  },
  {
    id: "4",
    date: todayDate,
    type: "Expense",
    amount: 3942,
    description: "expenses",
    category: "Budget",
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
      const { id, date, amount, description, type, category, user } =
        action.payload;
      const foundTransaction = state.find(
        (transaction) => transaction.id === id
      );
      if (foundTransaction) {
        foundTransaction.date = date;
        foundTransaction.user = user;
        foundTransaction.amount = amount;
        foundTransaction.description = description;
        foundTransaction.type = type;
        foundTransaction.category = category;
      }
    },
    // Action to remove a transaction
    transactionRemoved(state, action) {
      const { id } = action.payload;
      return state.filter((transaction) => transaction.id !== id);
    },
  },
});

export const { transactionAdded, transactionEdited, transactionRemoved } =
  transactionsSlice.actions;

export const selectTransaction = (state) => state.transactions;

export default transactionsSlice.reducer;
