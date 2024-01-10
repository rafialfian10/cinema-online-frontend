// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { CheckAuthValues } from "@/types/checkAuth";
import { ProfileValues } from "@/types/profile";
//------------------------------------------------------------

export const fetchUserAuth = createAsyncThunk(
  "user/fetch-user-auth",
  async (
    { session, status }: { session: any; status: any },
    { rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    if (status === "authenticated" && userAuth?.data?.token) {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: "Bearer " + userAuth?.data?.token,
        },
      };
  
      try {
        const response = await fetch(`http://localhost:5000/api/v1/user`, {
          cache: "no-store",
          headers: config.headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user auth");
        }
  
        const userData = await response.json();
        return userData.data;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch user auth"
        );
      }
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update-user",
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
      const response = await API.patch(`/user/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update user"
      );
    }
  }
);

export const updateUserPhoto = createAsyncThunk(
  "user/update-user-photo",
  async (
    { formData, id, session }: { formData: any; id: number; session: any },
    { dispatch, rejectWithValue }
  ) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await API.patch(`/user/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        // dispatch(fetchUserAuth({ session, status: "authenticated" }));
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update user photo"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
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
      const response = await API.delete(`/user/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete user"
      );
    }
  }
);

type userState = {
  user: CheckAuthValues;
  userPhoto: ProfileValues
  searchData: CheckAuthValues;
  loading: boolean;
  error: null | any;
};

const initialStateUser: userState = {
  user: {} as CheckAuthValues,
  userPhoto: {} as ProfileValues,
  searchData: {} as CheckAuthValues,
  loading: false,
  error: null,
};

const userSlices = createSlice({
  name: "userlice",
  initialState: initialStateUser,
  reducers: {
    User: (state, action: PayloadAction<CheckAuthValues>) => {
      state.user = action.payload;
    },
    UserPhoto: (state, action: PayloadAction<ProfileValues>) => {
      state.userPhoto = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserAuth.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchUserAuth.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchUserAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        state.user = state.user.id === action.payload.id ? action.payload : state.user
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateUserPhoto.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUserPhoto.fulfilled,
      (state, action: PayloadAction<ProfileValues>) => {
        state.loading = false;
        state.userPhoto = state.userPhoto.id === action.payload.id ? action.payload : state.userPhoto
      }
    );
    builder.addCase(updateUserPhoto.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteUser.fulfilled,
      (state, action: PayloadAction<CheckAuthValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.user = {} as CheckAuthValues;
        }
      }
    );
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { User, UserPhoto } = userSlices.actions;
export default userSlices.reducer;
