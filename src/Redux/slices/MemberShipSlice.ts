import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MembershipState = {
  openMembership: boolean;
};

const initialState: MembershipState = {
  openMembership: false,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    openMembership: (state) => {
      state.openMembership = true;
    },
    closeMembership: (state) => {
      state.openMembership = false;
    },
    toggleMembership: (state) => {
      state.openMembership = !state.openMembership;
    },
    setMembership: (state, action: PayloadAction<boolean>) => {
      state.openMembership = action.payload;
    },
  },
});

export default membershipSlice.reducer;
export const {
  openMembership,
  closeMembership,
  toggleMembership,
  setMembership,
} = membershipSlice.actions;

export const { reducer: membershipReducer } = membershipSlice;
