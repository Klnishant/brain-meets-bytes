import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type Category = {
  _id: string;
  CategoryId: number;
  title: string;
  route: string;
  color: string;
  description: string;
  threadCount: number;
  imageUrl: string;
};

type CategoriesState = {
  loading: boolean;
  error: string | null;
  list: Category[];
};

const initialState: CategoriesState = {
  loading: false,
  error: null,
  list: [],
};

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      return data.data as Category[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (
    {
      title,
      route,
      description,
      color,
      image,
      token,
    }: {
      title: string;
      route: string;
      description: string;
      color: string;
      image: string | null;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            route,
            description,
            color,
            image,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to create category");

      return data.data as Category;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async (
    {
      categoryId,
      title,
      route,
      description,
      color,
      image,
      token,
    }: {
      categoryId: number;
      title: string;
      route: string;
      description: string;
      color: string;
      image: string | null;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category?CategoryId=${categoryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            route,
            description,
            color,
            image,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update category");

      return data.data as Category;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (
    { categoryId, token }: { categoryId: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category?CategoryId=${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      return categoryId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* create */
      .addCase(createCategory.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      /* update */
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (c) => c.CategoryId === action.payload.CategoryId
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      /* delete */
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (c) => c.CategoryId !== action.payload
        );
      });
  },
});

export default categoriesSlice.reducer;

export const { reducer: categoriesReducer } = categoriesSlice;
