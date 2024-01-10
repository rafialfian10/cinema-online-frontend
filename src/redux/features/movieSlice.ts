// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { MovieValues } from "@/types/movie";
//------------------------------------------------------------

export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async (thunkAPI, { rejectWithValue }) => {
    const response = await fetch("http://localhost:5000/api/v1/movies");

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

export const fetchMovie = createAsyncThunk(
  "movie/fetch",
  async (
    { id }: { id: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/movie/${id}`);
      if (response.status === 200) {
        const result = await response.json();
        
        return result.data;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to fetch movie"
      );
    }
  }
);

export const createMovie = createAsyncThunk(
  "movie/create-movie",
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
      const response = await API.post("/movie", formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to create movie"
      );
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movie/update-movie",
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
      const response = await API.patch(`/movie/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update movie"
      );
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movie/delete-movie",
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
      const response = await API.delete(`/movie/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete movie"
      );
    }
  }
);

type movieState = {
  movies: MovieValues[];
  movie: MovieValues | null;
  loading: boolean;
  error: null | any;
};

const initialStateMovie: movieState = {
  movies: [] as MovieValues[],
  movie: null,
  loading: false,
  error: null,
};

const movieSlices = createSlice({
  name: "movieSlice",
  initialState: initialStateMovie,
  reducers: {
    Movie: (state, action: PayloadAction<MovieValues[]>) => {
      state.movies = action.payload;
      // console.log("state: ", state);
      // console.log("action: ", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMovies.fulfilled,
      (state, action: PayloadAction<MovieValues[]>) => {
        state.loading = false;
        state.movies = action.payload;
        // console.log("state: ", state);
        // console.log("action: ", action.payload); // return all data
      }
    );
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;
    });
    builder.addCase(fetchMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchMovie.fulfilled,
      (state, action: PayloadAction<MovieValues>) => {
        state.loading = false;
        state.movie = action.payload;
      }
    );
    builder.addCase(fetchMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createMovie.fulfilled,
      (state, action: PayloadAction<MovieValues>) => {
        // console.log("create category : ", state, action.payload);
        state.loading = false;
        state.movies.push(action.payload);
      }
    );
    builder.addCase(createMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;
    });
    builder.addCase(updateMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateMovie.fulfilled,
      (state, action: PayloadAction<MovieValues>) => {
        // console.log("update category", state, action.payload);
        state.loading = false;
        state.movies = state.movies.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;
    });
    builder.addCase(deleteMovie.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteMovie.fulfilled,
      (state, action: PayloadAction<MovieValues>) => {
        // console.log("delete category", state, action.payload);
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.movies = state.movies.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deleteMovie.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      // state.error = action.payload;
    });
  },
});

export const { Movie } = movieSlices.actions;
export default movieSlices.reducer;
