import { createSlice } from "@reduxjs/toolkit";

// Initial state of transactions
const initialState = [
    {id: "1", amount: 30, description: "Wal-Mart", type: "expense", category: "groceries"},
    {id: "2", amount: 500, description: "Paycheck", type: "income", category: "job"},
]

// Redux slice pertaining to transactions
export const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        // Action to add a transaction
        transactionAdded(state, action) {
            state.push(action.payload)
        }
    }
})

export const {transactionAdded} = transactionsSlice.actions

export const selectTransaction = (state) => state.transactions

export default transactionsSlice.reducer