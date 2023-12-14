// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { CategoryValues } from "@/types/category";
//------------------------------------------------------------

export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async (data, { rejectWithValue }) => {
    const response = await fetch("http://localhost:5000/api/v1/categories");

    try {
      if (response.status === 200) {
        const result = await response.json();
        return result.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create-category",
  async (
    { formData, session }: { formData: any; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.post("/category", formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update-category",
  async (
    { formData, id, session }: { formData: any; id: number; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.patch(`/category/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete-category",
  async (
    { id, session }: { id: number; session: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.delete(`/category/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete category"
      );
    }
  }
);

type categoryState = {
  categories: CategoryValues[];
  searchData: CategoryValues[];
  loading: boolean;
  error: null | any;
};

const initialCategoryState: categoryState = {
  categories: [] as CategoryValues[],
  searchData: [] as CategoryValues[],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: initialCategoryState,
  reducers: {
    Category: (state, action: PayloadAction<CategoryValues[]>) => {
      state.searchData = action.payload;
      console.log("state: ", state);
      console.log("action: ", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<CategoryValues[]>) => {
        state.loading = false;
        state.categories = action.payload;
        //   console.log("state: ", state);
        //   console.log("action: ", action.payload); // return all data
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;   
    });
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        // console.log("create category : ", state, action.payload);
        state.loading = false;
        state.categories.push(action.payload);
      }
    );
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;   
    });
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        // console.log("update category", state, action.payload);
        state.loading = false;
        state.categories = state.categories.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;   
    });
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        // console.log("delete category", state, action.payload);
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.categories = state.categories.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;   
    });
  },
});

export const { Category } = categorySlice.actions;
export default categorySlice.reducer;
