// // components redux
// import { createSlice, createAsyncThunk, PayloadAction, AnyAction } from "@reduxjs/toolkit";

// // component react
// import { useSession } from "next-auth/react";

// // api
// import { API } from "@/app/api/api";

// // types
// import { UserAuth } from "@/types/userAuth";
// import { CategoryValues } from "@/types/category";
// // ----------------------------------------------------------------

// export const fetchCategories = createAsyncThunk(
//   "fetchCategory",
//   async (data, { rejectWithValue }) => {
//     const response = await fetch("http://localhost:5000/categories");

//     try {
//       if (response.status === 200) {
//         const result = await response.json();
//         console.log(result);
//         return result;
//       }
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const createCategory = createAsyncThunk(
//   "createCategory",
//   async (formData, { rejectWithValue }) => {
//     console.log("data: ", formData);
//     const { data: session, status } = useSession();
//     const userAuth: UserAuth | undefined = session?.user;

//     const config = {
//       headers: {
//         "Content-type": "multipart/form-data",
//         Authorization: "Bearer " + userAuth?.data?.token,
//       },
//     };

//     try {
//       const response = await API.post("/category", formData, config);
//       console.log('response', response)

//       if (response.status === 200) {
//         const result = await response.data;
//         return result;
//       }
//     } catch (error) {
//       return rejectWithValue(
//         (error as Error).message || "Failed to create category"
//       );
//     }
//   }
// );

// export const updateCategory = createAsyncThunk(
//   "updateCategory",
//   async (data, { rejectWithValue }) => {
//     console.log("updated data", data);
//     const { data: session, status } = useSession();
//     const userAuth: UserAuth | undefined = session?.user;

//     const config = {
//       headers: {
//         "Content-type": "multipart/form-data",
//         Authorization: "Bearer " + userAuth?.data?.token,
//       },
//     };

//     try {
//       const response = await API.patch(`/category/${data}`, config);

//       if (response.status === 200) {
//         const result = await response.data;
//         return result;
//       }
//     } catch (error) {
//       return rejectWithValue(
//         (error as Error).message || "Failed to update category"
//       );
//     }
//   }
// );

// export const deleteCategory = createAsyncThunk(
//   "deleteCategory",
//   async (id, { rejectWithValue }) => {
//     const { data: session, status } = useSession();
//     const userAuth: UserAuth | undefined = session?.user;

//     const config = {
//       headers: {
//         "Content-type": "multipart/form-data",
//         Authorization: "Bearer " + userAuth?.data?.token,
//       },
//     };

//     try {
//       const response = await API.delete(`/category/${id}`, config);

//       if (response.status === 200) {
//         const result = await response.data;
//         return result;
//       }
//     } catch (error) {
//       return rejectWithValue(
//         (error as Error).message || "Failed to delete category"
//       );
//     }
//   }
// );

// type categoryState = {
//   categories: CategoryValues[];
//   searchData: CategoryValues[];
//   loading: boolean;
//   error: string | null;
// };

// const initialCategoryState: categoryState = {
//   categories: [],
//   searchData: [],
//   loading: false,
//   error: null,
// };

// export const categorySlice = createSlice({
//   name: "categorySlice",
//   initialState: initialCategoryState,
//   reducers: {
//     Category: (state, action: PayloadAction<CategoryValues[]>) => {
//       console.log("category bro: ", action.payload);
//       state.searchData = action.payload;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.categories = action.payload;
//       })
//       // .addCase(fetchCategories.rejected, (state, action) => {
//       //   state.loading = false;
//       //   state.error = action.payload.message;
//       // })
//       .addCase(createCategory.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createCategory.fulfilled, (state, action) => {
//         console.log('create category : ', state, action);
        
//         state.loading = false;
//         state.categories.push(action.payload);
//       })
//       // .addCase(createCategory.rejected, (state, action) => {
//       //   state.loading = false;
//       //   state.error = action.payload.message;
//       // })
//       .addCase(updateCategory.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateCategory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.categories = state.categories.map((element: any) =>
//           element.id === action.payload.id ? action.payload : element
//         );
//       })
//       // .addCase(updateCategory.rejected, (state, action) => {
//       //   state.loading = false;
//       //   state.error = action.payload.message;
//       // })
//       .addCase(deleteCategory.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteCategory.fulfilled, (state, action) => {
//         state.loading = false;
//         const { id } = action.payload;
//         if (id) {
//           state.categories = state.categories.filter(
//             (element: any) => element.id !== id
//           );
//         }
//       });
//       // .addCase(deleteCategory.rejected, (state, action) => {
//       //   state.loading = false;
//       //   state.error = action.payload.message;
//       // });
//   },
// });

// export const { Category } = categorySlice.actions;
// export default categorySlice.reducer;
