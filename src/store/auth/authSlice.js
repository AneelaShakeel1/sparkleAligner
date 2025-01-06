import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getInitialUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return {
        _id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        // Add other user fields you need
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      if (action.payload) {
        const decoded = jwtDecode(action.payload);
        state.user = {
          _id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          // Add other user fields you need
        };
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
