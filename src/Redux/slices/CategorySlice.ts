import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { form } from "sanity/structure";

type Category = {
  _id: string;
  CategoryId: number;
  title: string;
  route: string;
  color: string;
  description: string;
  threadCount: number;
  image: string;
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
  async (_, { rejectWithValue }) => {
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category`)

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
      image: File | null;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("route", route);
      formData.append("description", description);
      formData.append("color", color);
      if (image) {
        formData.append("image", image);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
      image: File | null;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("route", route);
      formData.append("description", description);
      formData.append("color", color);
      if (image) {
        formData.append("image", image);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}category?CategoryId=${categoryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
