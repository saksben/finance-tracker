import { createSlice } from "@reduxjs/toolkit";

// Initial state of users
const initialState = [
  { id: "1", name: "Me" },
  { id: "2", name: "Dad" },
  { id: "3", name: "Mom" },
  { id: "4", name: "Jonathan" },
];

// Redux slice pertaining to users
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Action to add a user
    userAdded(state, action) {
      state.push(action.payload);
    },
    // Action to edit a user
    userEdited(state, action) {
      const { id, name } = action.payload;
      const foundUser = state.find((user) => user.id === id);
      if (foundUser) {
        foundUser.name = name;
      }
    },
    // Action to delete a user
    userRemoved(state, action) {
      const { id } = action.payload;
      return state.filter((user) => user.id !== id);
    },
  },
});

export const { userAdded, userEdited, userRemoved } = usersSlice.actions;

export const selectUser = (state) => state.users;

export default usersSlice.reducer;
