import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

type LogInState = {
  openLogIn: boolean;
};

/* ================= INITIAL STATE ================= */

const initialState: LogInState = {
  openLogIn: false,
};

/* ================= SLICE ================= */

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    openLogIn: (state) => {
      state.openLogIn = true;
    },
    closeLogIn: (state) => {
      state.openLogIn = false;
    },
    toggleLogIn: (state) => {
      state.openLogIn = !state.openLogIn;
    },
    setLogIn: (state, action: PayloadAction<boolean>) => {
      state.openLogIn = action.payload;
    },
  },
});

/* ================= EXPORTS ================= */

export default loginSlice.reducer;
export const {
  openLogIn,
  closeLogIn,
  toggleLogIn,
  setLogIn,
} = loginSlice.actions;

export const { reducer: loginReducer } = loginSlice;
