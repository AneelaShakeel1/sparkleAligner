import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  approveOrDenyDoctor,
  fetchAllApprovals,
  fetchApprovalById,
  updateApproval,
} from "../../service/doctorApprovalService";

// Initial state with additional loading and error states for better management
const initialState = {
  doctorapprovals: [],
  approvalById: [],
  approval: null,
  loading: false,
  error: null,
};

// Async thunk to add a new approval
export const addapproveOrDenyDoctor = createAsyncThunk(
  "approveOrDenyDoctor",
  async (doctorApproveOrDenyData) => {
    try {
      const response = await approveOrDenyDoctor(doctorApproveOrDenyData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while adding approval"
      );
    }
  }
);

// Async thunk to fetch all approvals
export const fetchAllApprovalsAsync = createAsyncThunk(
  "/fetchApprovals",
  async () => {
    const response = await fetchAllApprovals();
    return response.data.approvals;
  }
);

// Async thunk to fetch an approval by id 
export const fetchApprovalByIdAsync = createAsyncThunk(
  "/fetchApprovalById",
  async (id) => {
    try {
      const response = await fetchApprovalById(id);
      return response.data.approvals;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while fetching the approval by ID."
      );
    }
  }
);

// Async thunk to update an approval
export const updateApprovalAsync = createAsyncThunk(
  "/updateApproval",
  async ({ id, ...doctorApproveOrDenyData }) => {
    const response = await updateApproval({
      id,
      doctorApproveOrDenyData,
    });
    return response.data.approvals;
  }
);

const doctorsApprovalSlice = createSlice({
  name: "doctorsApproval",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle addapproveOrDenyDoctor async action states
    builder
      .addCase(addapproveOrDenyDoctor.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addapproveOrDenyDoctor.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.doctorapprovals.push(action.payload); // Add the new approval to the approvals list
      })
      .addCase(addapproveOrDenyDoctor.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllApprovalsAsync async action states
    builder
      .addCase(fetchAllApprovalsAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchAllApprovalsAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.doctorapprovals = action.payload; // Update the approvals list with fetched data
      })
      .addCase(fetchAllApprovalsAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchApprovalByIdAsync async action states
    builder
      .addCase(fetchApprovalByIdAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchApprovalByIdAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.approvalById = action.payload; // Set the current approval
      })
      .addCase(fetchApprovalByIdAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle updateApprovalAsync async action states
    builder
      .addCase(updateApprovalAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApprovalAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.approvalById.findIndex(
          (approval) => approval.id === action.payload.id
        );
        if (index !== -1) {
          state.approvalById[index] = action.payload;
        }
      })
      .addCase(updateApprovalAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default doctorsApprovalSlice.reducer; // Export reducer
