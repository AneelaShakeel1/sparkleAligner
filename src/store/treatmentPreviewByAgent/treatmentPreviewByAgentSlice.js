import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createTreatmentPreviewByAgent,
  fetchAllTreatmentPreviewByAgent,
  fetchTreatmentPreviewByAgentById,
  updateTreatmentPreviewByAgent,
} from "../../service/treatmentPreviewByAgentService";

// Initial state with additional loading and error states for better management
const initialState = {
  treatmentpreviewsbyagent: [],
  treatmentpreviewsbyagentbyid: [],
  treatmentpreviewbyagent: null,
  loading: false,
  error: null,
};

// Async thunk to add a new treatment preview by agent
export const addTreatmentPreviewByAgent = createAsyncThunk(
  "treatmentpreviewbyagent",
  async (treatmentPreviewByAgentData) => {
    try {
      const response = await createTreatmentPreviewByAgent(
        treatmentPreviewByAgentData
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while adding the treatment preview by agent."
      );
    }
  }
);

// Async thunk to fetch all treatment previews by agent
export const fetchAllTreatmentPreviewByAgentAsync = createAsyncThunk(
  "/fetchTreatmentPreviewByAgent",
  async () => {
    const response = await fetchAllTreatmentPreviewByAgent();
    return response.data;
  }
);

// Async thunk to fetch a treatment preview by agent by ID
export const fetchTreatmentPreviewByAgentByIdAsync = createAsyncThunk(
  "/fetchTreatmentPreviewbyagentbyId",
  async (id) => {
    try {
      const response = await fetchTreatmentPreviewByAgentById(id);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while fetching the treatment preview by agent by ID."
      );
    }
  }
);

// Async thunk to update a treatment preview by agent
export const updateTreatmentPreviewByAgentAsync = createAsyncThunk(
  "/updateTreatmentPreviewByAgent",
  async ({ id, ...treatmentPreviewByAgentData }) => {
    const response = await updateTreatmentPreviewByAgent({
      id,
      treatmentPreviewByAgentData,
    });
    return response.data;
  }
);

const treatmentpreviewbyagentSlice = createSlice({
  name: "treatmentpreviewbyagent",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle addTreatmentPreviewByAgent async action states
    builder
      .addCase(addTreatmentPreviewByAgent.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addTreatmentPreviewByAgent.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.treatmentpreviewsbyagent.push(action.payload); // Add the new treatment preview by agent to the treatment previews by agent list
      })
      .addCase(addTreatmentPreviewByAgent.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllTreatmentPreviewByAgentAsync async action states
    builder
      .addCase(fetchAllTreatmentPreviewByAgentAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(
        fetchAllTreatmentPreviewByAgentAsync.fulfilled,
        (state, action) => {
          state.loading = false; // Set loading state to false on success
          state.treatmentpreviewsbyagent = action.payload; // Update the traetment previews  by agent list with fetched data
        }
      )
      .addCase(
        fetchAllTreatmentPreviewByAgentAsync.rejected,
        (state, action) => {
          state.loading = false; // Set loading to false on error
          state.error = action.error.message; // Set error message
        }
      );

    // Handle fetchTreatmentPreviewByAgentByIdAsync async action states
    builder
      .addCase(fetchTreatmentPreviewByAgentByIdAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(
        fetchTreatmentPreviewByAgentByIdAsync.fulfilled,
        (state, action) => {
          state.loading = false; // Set loading state to false on success
          state.treatmentpreviewsbyagentbyid = action.payload; // Set the current treatment preview by agent
        }
      )
      .addCase(
        fetchTreatmentPreviewByAgentByIdAsync.rejected,
        (state, action) => {
          state.loading = false; // Set loading to false on error
          state.error = action.error.message; // Set error message
        }
      );

    // Handle updateTreatmentPreviewByAgentAsync async action states
    builder
      .addCase(updateTreatmentPreviewByAgentAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateTreatmentPreviewByAgentAsync.fulfilled,
        (state, action) => {
          state.loading = false;
          const index = state.treatmentpreviewsbyagentbyid.findIndex(
            (treatmentpreviewbyagent) =>
              treatmentpreviewbyagent.id === action.payload.id
          );
          if (index !== -1) {
            state.treatmentpreviewsbyagentbyid[index] = action.payload;
          }
        }
      )
      .addCase(updateTreatmentPreviewByAgentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default treatmentpreviewbyagentSlice.reducer; // Export reducer
