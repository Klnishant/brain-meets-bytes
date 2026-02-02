import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

type MembershipState = {
  openMembership: boolean;
};

/* ================= INITIAL STATE ================= */

const initialState: MembershipState = {
  openMembership: false,
};

/* ================= SLICE ================= */

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

/* ================= EXPORTS ================= */

export default membershipSlice.reducer;
export const {
  openMembership,
  closeMembership,
  toggleMembership,
  setMembership,
} = membershipSlice.actions;

export const { reducer: membershipReducer } = membershipSlice;
