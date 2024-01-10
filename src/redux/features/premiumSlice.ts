// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { PremiumValues } from "@/types/premium";
//------------------------------------------------------------

export const fetchPremiums = createAsyncThunk(
  "premiums/fetch",
  async ({ session }: { session: any }, { rejectWithValue }) => {
    const userAuth: UserAuth | undefined = session?.user;

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: "Bearer " + userAuth?.data?.token,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/premis`,
        {
          cache: "no-store",
          headers: config.headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch premiums");
      }

      const userData = await response.json();
      return userData.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPremium = createAsyncThunk(
  "premium/fetch",
  async (
    { id, session }: { id: number, session: any },
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
      const response = await fetch(`http://localhost:5000/api/v1/premi/${id}`, config);
      if (response.status === 200) {
        const result = await response.json();
        
        return result.data;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch premium"
      );
    }
  }
);

export const createPremium = createAsyncThunk(
  "premium/create-premium",
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
      const response = await API.post("/premi", formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to create premium"
      );
    }
  }
);

export const updatePremiumUser = createAsyncThunk(
  "premium/update-premium-user",
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
      const response = await API.patch(`/premi_user/${id}`, formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update premium user"
      );
    }
  }
);

export const updatePremiumAdmin = createAsyncThunk(
  "premium/update-premium-admin",
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
      const response = await API.patch(`/premi_admin/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update premium admin"
      );
    }
  }
);

export const updatePremiumExpired = createAsyncThunk(
  "premium/update-premium-expired",
  async (
    { id }: { id: number; },
    { rejectWithValue }
  ) => {
    try {
      const response = await API.patch(`/premi_expired/${id}`);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update premium expired"
      );
    }
  }
);

export const deletePremium = createAsyncThunk(
  "premium/delete-premium",
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
      const response = await API.delete(`/premi/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete premium"
      );
    }
  }
);

type PremiumState = {
  premiums: PremiumValues[];
  premium: PremiumValues;
  loading: boolean;
  error: null | any;
};

const initialStatePremium: PremiumState = {
  premiums: [] as PremiumValues[],
  premium: {} as PremiumValues,
  loading: false,
  error: null,
};

const premiumSlice = createSlice({
  name: "premiumSlice",
  initialState: initialStatePremium,
  reducers: {
    Premiums: (state, action: PayloadAction<PremiumValues[]>) => {
      state.premiums = action.payload;
    },
    Premium: (state, action: PayloadAction<PremiumValues>) => {
      state.premium = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPremiums.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchPremiums.fulfilled,
      (state, action: PayloadAction<PremiumValues[]>) => {
        state.loading = false;
        state.premiums = action.payload;
      }
    );
    builder.addCase(fetchPremiums.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchPremium.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchPremium.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        state.premium = action.payload;
      }
    );
    builder.addCase(fetchPremium.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createPremium.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createPremium.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        state.premiums.push(action.payload);
      }
    );
    builder.addCase(createPremium.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updatePremiumUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updatePremiumUser.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        state.premiums = state.premiums.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updatePremiumUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updatePremiumAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updatePremiumAdmin.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        state.premiums = state.premiums.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updatePremiumAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updatePremiumExpired.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updatePremiumExpired.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        state.premiums = state.premiums.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updatePremiumExpired.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deletePremium.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deletePremium.fulfilled,
      (state, action: PayloadAction<PremiumValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.premiums = state.premiums.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deletePremium.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Premiums, Premium } = premiumSlice.actions;
export default premiumSlice.reducer;
