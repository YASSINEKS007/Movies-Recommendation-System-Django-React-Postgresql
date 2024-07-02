import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  access: null,
  refresh : null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode == "light" ? "dark" : "light";
    },

    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
    },

    setLogout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
    },
  },
});

export const { setMode, setLogin, setLogout } = authSlice.actions;

export default authSlice.reducer;
