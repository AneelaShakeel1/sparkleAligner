import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchAllPatientsApprovals } from "../../service/patientsApprovalsService";

// Initial state with additional loading and error states for better management
const initialState = {
  approvals: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all patients approvals
export const fetchAllPatientsApprovalsAsync = createAsyncThunk(
  "/fetchPatientsApprovals",
  async () => {
    const response = await fetchAllPatientsApprovals();
    return response.data.approvals;
  }
);

const patientsApprovalsSlice = createSlice({
  name: "patientsApprovals",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle fetchAllPatientsApprovalsAsync async action states
    builder
      .addCase(fetchAllPatientsApprovalsAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchAllPatientsApprovalsAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.approvals = action.payload; // Update the  patients approvals list with fetched data
      })
      .addCase(fetchAllPatientsApprovalsAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });
  },
});

export default patientsApprovalsSlice.reducer; // Export reducer
