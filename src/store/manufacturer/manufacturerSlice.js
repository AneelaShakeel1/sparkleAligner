import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createManufacturer,
  fetchAllManufacturers,
  fetchManufacturerById,
  updateManufacturer,
} from "../../service/manufacturerService";

// Initial state with additional loading and error states for better management
const initialState = {
  manufacturers: [],
  manufacturersbyid: [],
  manufacturer: null,
  loading: false,
  error: null,
};

// Async thunk to add a new manufacturer
export const addManufacturer = createAsyncThunk(
  "manufacturer",
  async (manufacturerData) => {
    try {
      const response = await createManufacturer(manufacturerData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while adding the manufacturer."
      );
    }
  }
);

// Async thunk to fetch all manufacturers
export const fetchAllManufacturerAsync = createAsyncThunk(
  "/fetchManufacturer",
  async () => {
    const response = await fetchAllManufacturers();
    return response.data;
  }
);

// Async thunk to fetch a manufacturer by ID
export const fetchManufacturerByIdAsync = createAsyncThunk(
  "/fetchManufacturerbyId",
  async (id) => {
    try {
      const response = await fetchManufacturerById(id);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.message);
      throw (
        error.response?.data?.message ||
        "An error occurred while fetching the manufacturer by ID."
      );
    }
  }
);

// Async thunk to update a manufacturer
export const updateManufacturerAsync = createAsyncThunk(
  "/updateManufacturer",
  async ({ id, ...manufacturerData }) => {
    const response = await updateManufacturer({ id, manufacturerData });
    return response.data;
  }
);

const manufacturerSlice = createSlice({
  name: "manufacturer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Handle addManufacturer async action states
    builder
      .addCase(addManufacturer.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(addManufacturer.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.manufacturers.push(action.payload); // Add the new manufacturer to the manufacturers list
      })
      .addCase(addManufacturer.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchAllManufacturerAsync async action states
    builder
      .addCase(fetchAllManufacturerAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchAllManufacturerAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.manufacturers = action.payload; // Update the manufacturers list with fetched data
      })
      .addCase(fetchAllManufacturerAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle fetchManufacturerByIdAsync async action states
    builder
      .addCase(fetchManufacturerByIdAsync.pending, (state) => {
        state.loading = true; // Set loading state when the request is pending
      })
      .addCase(fetchManufacturerByIdAsync.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false on success
        state.manufacturersbyid = action.payload; // Set the current manufacturer
      })
      .addCase(fetchManufacturerByIdAsync.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Set error message
      });

    // Handle updateManufacturerAsync async action states
    builder
      .addCase(updateManufacturerAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateManufacturerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.manufacturersbyid.findIndex(
          (manufacturer) => manufacturer.id === action.payload.id
        );
        if (index !== -1) {
          state.manufacturersbyid[index] = action.payload;
        }
      })
      .addCase(updateManufacturerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default manufacturerSlice.reducer; // Export reducer
