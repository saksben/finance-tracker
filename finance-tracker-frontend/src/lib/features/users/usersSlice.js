import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks to fetch, add, edit, and delete users from the backend API
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("/api/users"); // Proxy to backend
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
});

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id) => {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch user")
    }
    const data = await response.json()
    return data
  }
)

export const addUser = createAsyncThunk("users/addUser", async (newUser) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({id, name}) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name}),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json()
    return data;
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return id;
});

// Initial state of users
// const initialState = [
//   { id: "1", name: "Me" },
//   { id: "2", name: "Dad" },
//   { id: "3", name: "Mom" },
//   { id: "4", name: "Jonathan" },
// ];
const initialState = {
  users: [],
  status: "idle",
  error: null,
};

// Redux slice pertaining to users
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const fetchedUser = action.payload;
        const existingUser = state.users.find((user) => user.id === fetchedUser.id)
        if (existingUser) {
          Object.assign(existingUser, fetchedUser)
        } else {
          state.users.push(fetchedUser)
        }
      })
      // Add user
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const existingUser = state.users.find(
          (user) => user.id === updatedUser.id
        );
        if (existingUser) {
          Object.assign(existingUser, updatedUser);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        state.users = state.users.filter((user) => user.id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const selectUsers = (state) => state.users.users;

export default usersSlice.reducer;
