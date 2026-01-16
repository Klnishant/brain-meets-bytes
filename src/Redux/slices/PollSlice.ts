import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type Option = {
  votedUserIds: number[];
  OptionId: number;
  PollId: number;
  text: string;
  voteCount: number;
};

type Poll = {
  userId: number | null;
  PollId: number;
  title: string;
  description: string;
  totalVotes: number;
  options: Option[];
};

type PollsState = {
  polls: Poll[];
  loading: boolean;
  error: string | null;
};

const initialState = {
  polls: [] as Poll[],
  loading: false,
  error: null as string | null,
};

export const fetchPolls = createAsyncThunk(
  "polls/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}polls`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch polls");

      const data = await res.json();
      return data.data as Poll[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPoll = createAsyncThunk(
  "polls/create",
  async (
    {
      title,
      description,
      options,
      token,
    }: { title: string; description: string; options: string[]; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}polls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, options }),
      });

      if (!res.ok) throw new Error("Failed to create poll");

      const data = await res.json();
      return data.data as Poll;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePoll = createAsyncThunk(
  "polls/update",
  async (
    {
      PollId,
      title,
      description,
      options,
      token,
    }: {
      PollId: number;
      title: string;
      description: string;
      options: string[];
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}polls?PollId=${PollId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            options,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update poll");

      return data.data as Poll;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.polls.unshift(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePoll.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.polls.findIndex(
          (p) => p.PollId === action.payload.PollId
        );
        if (index !== -1) {
          state.polls[index] = action.payload;
        }
      })
      .addCase(updatePoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pollsSlice.reducer;

export const { reducer: pollsReducer } = pollsSlice;
