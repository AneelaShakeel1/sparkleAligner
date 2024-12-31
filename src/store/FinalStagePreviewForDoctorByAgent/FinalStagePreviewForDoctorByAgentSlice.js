import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createFinalStagePreview,
  fetchAllFinalStagePreviews,
  fetchFinalStagePreviewById,
  updateFinalStagePreview,
} from "../../service/FinalStagePreviewForDoctorByAgentService";

// Initial state with additional loading and error states for better management
const initialState = {
  finalStagePreviews: [],
  finalStagePreviewsById: [],
  finalStagePreview: null,
  loading: false,
  error: null,
};

// Async thunk to add a new final Stage Preview
export const addFinalStagePreview = createAsyncThunk(
  "finalStagePreview",
  async (finalStagePreviewData) => {
    try {
      const response = await createFinalStagePreview(finalStagePreviewData);
      return response.data.preview;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while adding final Stage Preview"
      );
    }
  }
);

// Async thunk to fetch all Final Stage Previews
export const fetchAllFinalStagePreviewsAsync = createAsyncThunk(
  "/fetchFinalStagePreviews",
  async () => {
    const response = await fetchAllFinalStagePreviews();
    return response.data.preview;
  }
);

// Async thunk to fetch a final stage preview by ID
export const fetchFinalStagePreviewByIdAsync = createAsyncThunk(
  "/fetchFinalStagePreviewById",
  async (id) => {
    try {
      const response = await fetchFinalStagePreviewById(id);
      return response.data.preview;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while fetching the final stage preview by ID."
      );
    }
  }
);

// Async thunk to update a final stage preview
export const updateFinalStagePreviewAsync = createAsyncThunk(
  "/updateFinalStagePreview",
  async ({ id, ...finalStagePreviewData }) => {
    const response = await updateFinalStagePreview({
      id,
      finalStagePreviewData,
    });
    return response.data.preview;
  }
);

const finalStagePreviewSlice = createSlice({
  name: "finalStagePreview",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle addFinalStagePreview async action states
    builder
      .addCase(addFinalStagePreview.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addFinalStagePreview.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.finalStagePreviews.push(action.payload); // Add the new final stage preview to the final stage previews list
      })
      .addCase(addFinalStagePreview.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllFinalStagePreviewsAsync async action states
    builder
      .addCase(fetchAllFinalStagePreviewsAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(
        fetchAllFinalStagePreviewsAsync.fulfilled,
        (state, action) => {
          state.loading = false; // Set loading state to false on success
          state.finalStagePreviews = action.payload; // Update the final stage previews list with fetched data
        }
      )
      .addCase(
        fetchAllFinalStagePreviewsAsync.rejected,
        (state, action) => {
          state.loading = false; // Set loading to false on error
          state.error = action.error.message; // Set error message
        }
      );

    // Handle fetchFinalStagePreviewByIdAsync async action states
    builder
      .addCase(fetchFinalStagePreviewByIdAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(
        fetchFinalStagePreviewByIdAsync.fulfilled,
        (state, action) => {
          state.loading = false; // Set loading state to false on success
          state.finalStagePreviewsById = action.payload; // Set the current final stage preview
        }
      )
      .addCase(
        fetchFinalStagePreviewByIdAsync.rejected,
        (state, action) => {
          state.loading = false; // Set loading to false on error
          state.error = action.error.message; // Set error message
        }
      );

    // Handle updateFinalStagePreviewAsync async action states
    builder
      .addCase(updateFinalStagePreviewAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateFinalStagePreviewAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          const index = state.finalStagePreviewsById.findIndex(
            (finalStagePreview) =>
                finalStagePreview.id === action.payload.id
          );
          if (index !== -1) {
            state.finalStagePreviewsById[index] = action.payload;
          }
        }
      )
      .addCase(updateFinalStagePreviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default finalStagePreviewSlice.reducer; // Export reducer
