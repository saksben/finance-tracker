import { createSlice } from "@reduxjs/toolkit";

// Redux slice pertaining to categories
export const categorySlice = createSlice({
  name: "categories",
  initialState: [{ id: 1, name: "Food" }],
  reducers: {
    // Action to add category
    categoryAdded(state, action) {
      state.push(action.payload);
    },
  },
});

export const { categoryAdded } = categorySlice.actions;

export const selectCategory = (state) => state.categories;

export default categorySlice.reducer;
