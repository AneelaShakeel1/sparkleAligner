import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTreatmentPreview,
  fetchAllTreatmentPreviews,
  fetchTreatmentPreviewById,
  updateTreatmentPreview,
} from "../../service/treatmentpreviewService";

// Initial state with additional loading and error states for better management
const initialState = {
  treatmentpreviews: [],
  treatmentpreviewsbyid: [],
  treatmentpreview: null,
  loading: false,
  error: null,
};

// Async thunk to add a new treatment preview
export const addTreatmentPreview = createAsyncThunk(
  "treatmentpreview",
  async (treatmentpreviewData) => {
    try {
      const response = await createTreatmentPreview(treatmentpreviewData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while adding the treatment preview."
      );
    }
  }
);

// Async thunk to fetch all treatment previews
export const fetchAllTreatmentPreviewAsync = createAsyncThunk(
  "/fetchTreatmentPreview",
  async () => {
    const response = await fetchAllTreatmentPreviews();
    return response.data;
  }
);

// Async thunk to fetch a treatment preview by ID
export const fetchTreatmentPreviewByIdAsync = createAsyncThunk(
  "/fetchTreatmentPreviewbyId",
  async (id) => {
    try {
      const response = await fetchTreatmentPreviewById(id);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while fetching the treatment preview by ID."
      );
    }
  }
);

// Async thunk to update a treatment preview
export const updateTreatmentPreviewAsync = createAsyncThunk(
  "/updateTreatmentPreview",
  async ({ id, ...treatmentpreviewData }) => {
    const response = await updateTreatmentPreview({ id, treatmentpreviewData });
    return response.data;
  }
);

const treatmentpreviewSlice = createSlice({
  name: "treatmentpreview",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle addTreatmentPreview async action states
    builder
      .addCase(addTreatmentPreview.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addTreatmentPreview.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.treatmentpreviews.push(action.payload); // Add the new treatment preview to the treatment previews list
      })
      .addCase(addTreatmentPreview.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllTreatmentPreviewAsync async action states
    builder
      .addCase(fetchAllTreatmentPreviewAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchAllTreatmentPreviewAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.treatmentpreviews = action.payload; // Update the traetment previews list with fetched data
      })
      .addCase(fetchAllTreatmentPreviewAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchTreatmentPreviewByIdAsync async action states
    builder
      .addCase(fetchTreatmentPreviewByIdAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchTreatmentPreviewByIdAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.treatmentpreviewsbyid = action.payload; // Set the current treatment preview
      })
      .addCase(fetchTreatmentPreviewByIdAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle updateTreatmentPreviewAsync async action states
    builder
      .addCase(updateTreatmentPreviewAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTreatmentPreviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.treatmentpreviewsbyid.findIndex(
          (treatmentpreview) => treatmentpreview.id === action.payload.id
        );
        if (index !== -1) {
          state.treatmentpreviewsbyid[index] = action.payload;
        }
      })
      .addCase(updateTreatmentPreviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default treatmentpreviewSlice.reducer; // Export reducer
