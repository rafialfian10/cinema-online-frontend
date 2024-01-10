// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { RatingValues } from "@/types/rating";
//------------------------------------------------------------

export const fetchRatings = createAsyncThunk(
  "ratings/fetch",
  async (thunkAPI, { rejectWithValue }) => {
    const response = await fetch("http://localhost:5000/api/v1/ratings");

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

export const fetchRating = createAsyncThunk(
  "rating/fetch",
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
      const response = await fetch(`http://localhost:5000/api/v1/rating/${id}`);
      if (response.status === 200) {
        const result = await response.json();
        return result.data;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch rating"
      );
    }
  }
);

export const createRating = createAsyncThunk(
  "rating/create-rating",
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
      const response = await API.post("/rating", formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to create rating"
      );
    }
  }
);

export const deleterating = createAsyncThunk(
  "rating/delete-rating",
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
      const response = await API.delete(`/rating/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete rating"
      );
    }
  }
);

type ratingState = {
  ratings: RatingValues[];
  rating: RatingValues | null;
  loading: boolean;
  error: null | any;
};

const initialStateRating: ratingState = {
  ratings: [] as RatingValues[],
  rating: null,
  loading: false,
  error: null,
};

const ratingSlice = createSlice({
  name: "ratingSlice",
  initialState: initialStateRating,
  reducers: {
    Rating: (state, action: PayloadAction<RatingValues[]>) => {
      state.ratings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRatings.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRatings.fulfilled,
      (state, action: PayloadAction<RatingValues[]>) => {
        state.loading = false;
        state.ratings = action.payload;
      }
    );
    builder.addCase(fetchRatings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchRating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchRating.fulfilled,
      (state, action: PayloadAction<RatingValues>) => {
        state.loading = false;
        state.rating = action.payload;
      }
    );
    builder.addCase(fetchRating.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createRating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createRating.fulfilled,
      (state, action: PayloadAction<RatingValues>) => {
        state.loading = false;
        state.ratings.push(action.payload);
      }
    );
    builder.addCase(createRating.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleterating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleterating.fulfilled,
      (state, action: PayloadAction<RatingValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.ratings = state.ratings.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deleterating.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Rating } = ratingSlice.actions;
export default ratingSlice.reducer;
