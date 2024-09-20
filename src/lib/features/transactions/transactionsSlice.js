import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Get today's date for initial slice and format it as select element
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const todayDate = `${year}-${month}-${day}`;

// Async thunks to fetch, add, edit, and delete transactions from the backend
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await fetch("/api/transactions");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json()
    console.log('Fetched transactions:', data)
    return data
  }
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchTransactionById",
  async (id) => {
    const response = await fetch(`/api/transactions/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch transaction");
    }
    const data = await response.json();
    return data;
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (newTransaction) => {
    const response = await fetch("api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, ...transactionData }) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...transactionData }),
    });
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    const data = await response.json();
    return data;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
    return id;
  }
);

const initialState = {
  transactions: [],
  status: 'idle',
  error: null,
}

// Redux slice pertaining to transactions
export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchTransactions.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.transactions = action.payload
    })
    .addCase(fetchTransactionById.fulfilled, (state, action) => {
      const fetchedTransaction = action.payload
      const existingTransaction = state.transactions.find((transaction) => transaction.id === fetchedTransaction.id)
      if (existingTransaction) {
        Object.assign(existingTransaction, fetchedTransaction)
      } else {
        state.transactions.push(fetchedTransaction)
      }
    })
    .addCase(addTransaction.fulfilled, (state, action) => {
      state.transactions.push(action.payload)
    })
    .addCase(updateTransaction.fulfilled, (state, action) => {
      const updatedTransaction = action.payload
      const existingTransaction = state.transactions.find((transaction) => transaction.id === updatedTransaction.id)
      if (existingTransaction) {
        Object.assign(existingTransaction, updatedTransaction)
      }
    })
    .addCase(deleteTransaction.fulfilled, (state, action) => {
      const transactionId = action.payload
      state.transactions = state.transactions.filter((transaction) => transaction.id !== transactionId)
    })
  }
});

export const selectTransactions = (state) => state.transactions.transactions;

export default transactionsSlice.reducer;
