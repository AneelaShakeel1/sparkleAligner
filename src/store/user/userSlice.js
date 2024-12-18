import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createUser,
  loginUser,
  loginAdminUser,
  fetchAllUsers,
  updateUser,
  deleteUser,
} from "../../service/userservice";

// Initial state with additional loading and error states for better management
const initialState = {
  users: [],
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for user login
export const login = createAsyncThunk(
  "/login",
  async ({ email, password }) => {
    try {
      const response = await loginUser({ email, password });
      return response.data; // Return the token directly
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  }
);

// Async thunk for admin login
export const adminlogin = createAsyncThunk(
  "/auth/admin",
  async ({ email, password }) => {
    try {
      const response = await loginAdminUser({ email, password });
      return response.data; // Return the token directly
    } catch (error) {
      console.error("Admin login failed:", error.message);
      throw error;
    }
  }
);

// Async thunk to add a new user
export const addUser = createAsyncThunk("signup", async (userData) => {
  try {
    const response = await createUser(userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.message);
    throw error.response?.data?.message || "An error occurred while adding the user."; // Fallback message
  }
});

// Async thunk to fetch all users
export const fetchAllUserAsync = createAsyncThunk("/fetchUser", async () => {
  const response = await fetchAllUsers();
  return response.data;
});

// Async thunk to update a user
export const updateUserAsync = createAsyncThunk(
  "/updateUser",
  async ({ id, ...userData }) => {
    const response = await updateUser({ id, userData });
    return response.data;
  }
);

// Async thunk to delete a user
export const deleteUserAsync = createAsyncThunk("/deleteUser", async (id) => {
  await deleteUser(id); // Delete user by id
  return id; // Return id to remove the user from the state
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeToken: (state, action) => {
      state.token = action.payload; // Store token in state
      localStorage.setItem('token', action.payload); // Optionally store token in localStorage
    },
    clearError: (state) => {
      state.error = null; // Clear any errors from the state
    },
  },
  extraReducers(builder) {
    // Handle login and admin login
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload; // Store token in state
      })
      .addCase(adminlogin.fulfilled, (state, action) => {
        state.token = action.payload; // Store token in state
      });

    // Handle addUser async action states
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.users.push(action.payload); // Add the new user to the users list
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllUserAsync async action states
    builder
      .addCase(fetchAllUserAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchAllUserAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.users = action.payload; // Update the users list with fetched data
      })
      .addCase(fetchAllUserAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle updateUserAsync async action states
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Handle deleteUserAsync async action states
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = userSlice.actions; // Export actions
export default userSlice.reducer; // Export reducer
