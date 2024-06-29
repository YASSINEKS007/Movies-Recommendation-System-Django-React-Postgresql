import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  accessToken: null,
  refreshToken: null,
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
      state.accessToken = action.payload.accessToken;
    },

    setLogout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setMode, setLogin, setLogout } = authSlice.actions;

export default authSlice.reducer;
