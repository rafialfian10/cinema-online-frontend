// components react
import { useSession } from "next-auth/react";

// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { CategoryValues } from "@/types/category";
import { log } from "console";
//------------------------------------------------------------

export const fetchCategoriess = createAsyncThunk(
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
  "create/create",
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
      console.log("response", response);

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

type categoryState = {
  categories: CategoryValues[];
  searchData: CategoryValues[];
  loading: boolean;
  error: string | null;
};

const initialCategoryState: categoryState = {
  categories: [] as CategoryValues[],
  searchData: [] as CategoryValues[],
  loading: false,
  error: null,
};

// const initialState = {
//     entities: [],
//     loading: false,
//     value: 10,
// } as any;

const categorySlice = createSlice({
  name: "category",
  initialState: initialCategoryState,
  reducers: {
    Category: (state, action: PayloadAction<CategoryValues[]>) => {
      state.searchData = action.payload;
      // console.log("state: ", state);
      // console.log("action: ", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCategoriess.fulfilled,
      (state, action: PayloadAction<CategoryValues[]>) => {
        state.loading = false;
        state.categories.push(...action.payload);
        //   console.log("state: ", state);
        //   console.log("action: ", action.payload); // return all data
      }
    );
    builder.addCase(fetchCategoriess.pending, (state, action) => {
      state.loading = true;
    });
    // builder.addCase(fetchCategoriess.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    // });
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CategoryValues>) => {
        console.log("create category : ", state, action);
        state.loading = false;
        state.categories.push(action.payload);
      }
    );
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
    });
    // builder.addCase(createCategory.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.message;
    // });
  },
});

export const { Category } = categorySlice.actions;
export default categorySlice.reducer;
