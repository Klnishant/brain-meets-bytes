import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type LogInState = {
  openLogIn: boolean;
};

const initialState: LogInState = {
  openLogIn: false,
};

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

export default loginSlice.reducer;
export const {
  openLogIn,
  closeLogIn,
  toggleLogIn,
  setLogIn,
} = loginSlice.actions;

export const { reducer: loginReducer } = loginSlice;
