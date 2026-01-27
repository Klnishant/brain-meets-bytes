import { getAuth } from "@/lib/getAuth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type Auth = {
    token: string | null;
    userId: number | null;
}

type AuthState = {
    auth: Auth;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    auth:  {
        token: null,
        userId: null
    },
    loading: false,
    error: null,
};

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async () => {
    const auth = await getAuth();
    return { token: auth?.token, userId: auth?.userId };
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth: (state) => {
      state.auth.token = null;
      state.auth.userId = null;
      state.loading = false;
      state.error = null;
    },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.auth.token = action.payload.token;
                state.auth.userId = action.payload.userId;
            })
            .addCase(fetchAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch auth";
            })
    },
});

export default authSlice.reducer;
export const { clearAuth } = authSlice.actions;

export const { reducer: authReducer } = authSlice;