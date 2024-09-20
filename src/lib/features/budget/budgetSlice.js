import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Initial state
// const initialState = [
//   {
//     id: "1",
//     name: "Personal Account",
//     estimatedRevenue: 2000,
//     categories: [
//       { id: "1", name: "Food", estimate: 50 },
//       { id: "2", name: "Rent", estimate: 1500 },
//     ],
//     users: [{ id: "1", name: "Me", estimate: 1550 }],
//     alertOverbudget: true,
//     alertOverAmount: true,
//     alertAmount: 1000,
//     overbudget: false,
//   },
//   {
//     id: "2",
//     name: "Joint Account",
//     estimatedRevenue: 3870,
//     categories: [{ id: "3", name: "Budget", estimate: 3870 }],
//     users: [
//       { id: "1", name: "Me", estimate: 1333 },
//       { id: "2", name: "Jonathan", estimate: 1204 },
//       { id: "3", name: "Dad", estimate: 1333 },
//     ],
//     alertOverbudget: false,
//     alertOverAmount: false,
//     overbudget: false,
//   },
// ];

// Async thunks to fetch, add, edit, and delete budgets
export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async () => {
    const response = await fetch("/api/budgets");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetched budgets:", data);
    return data;
  }
);

export const fetchBudgetById = createAsyncThunk(
  "budgets/fetchBudgetById",
  async (id) => {
    const response = await fetch(`/api/budgets/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }
    const data = await response.json();
    return data;
  }
);

export const addBudget = createAsyncThunk(
  "budgets/addBudget",
  async (newBudget) => {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBudget),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({ id, ...budgetData }) => {
    const response = await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...budgetData }),
    });
    if (!response.ok) {
      throw new Error("Failed to update budget");
    }
    const data = await response.json();
    return data;
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id) => {
    const response = await fetch(`/api/budgets/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }
    return id;
  }
);

const initialState = {
  budgets: [],
  status: 'idle',
  error: null,
};

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
  // reducers: {
  //   // Action to add a budget to state
  //   budgetAdd(state, action) {
  //     state.push(action.payload);
  //   },
  //   // Action to edit a budget in state
  //   budgetEdited(state, action) {
  //     const {
  //       id,
  //       name,
  //       estimatedRevenue,
  //       categories,
  //       users,
  //       transactions = [],
  //     } = action.payload;
  //     const foundBudget = state.find((budget) => budget.id === id);
  //     if (foundBudget) {
  //       foundBudget.name = name;
  //       foundBudget.estimatedRevenue = estimatedRevenue;
  //       foundBudget.categories = categories;
  //       foundBudget.users = users;
  //       foundBudget.overbudget = calculateOverbudget(foundBudget, transactions);
  //     }
  //   },
  //   // Action to remove a budget from state
  //   budgetRemoved(state, action) {
  //     const { id } = action.payload;
  //     return state.filter((budget) => budget.id !== id);
  //   },
  //   // Load initial budgets from the start so higher-level pages have access to budget alerts instead of needing to visit budget details first
  //   loadBudgets(state, action) {
  //     return action.payload.budgets.map((budget) => ({
  //       ...budget,
  //       overbudget: calculateOverbudget(budget, action.payload.transactions),
  //     }));
  //   },
  // },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.budgets = action.payload;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        const fetchedBudget = action.payload;
        const existingBudget = state.budgets.find(
          (budget) => budget.id === fetchedBudget.id
        );
        if (existingBudget) {
          Object.assign(existingBudget, fetchedBudget);
        } else {
          state.budgets.push(fetchedBudget);
        }
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const updatedBudget = action.payload;
        const existingBudget = state.budgets.find(
          (budget) => budget.id === updatedBudget.id
        );
        if (existingBudget) {
          Object.assign(existingBudget, updatedBudget);
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        const budgetId = action.payload;
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== budgetId
        );
      });
  },
});

export const { budgetAdd, budgetEdited, budgetRemoved, loadBudgets } =
  budgetSlice.actions;

export const selectBudgets = (state) => state.budgets.budgets;

export default budgetSlice.reducer;
