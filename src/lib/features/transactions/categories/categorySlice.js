import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunks to fetch and add categories from the backend API
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await fetch("/api/categories");
    return response.json();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (newCategory) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    return response.json();
  }
);

// const initialState = [
//   { id: "1", name: "Food" },
//   { id: "2", name: "Rent" },
//   { id: "3", name: "Budget" },
// ],

const initialState = {
  categories: [],
  status: "idle",
  error: null,
};

// Redux slice pertaining to categories
export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});


export const selectCategories = (state) => state.categories.categories;

export default categorySlice.reducer;
