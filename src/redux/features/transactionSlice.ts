// components redux
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// api
import { API } from "@/app/api/api";

// types
import { UserAuth } from "@/types/userAuth";
import { TransactionValues } from "@/types/transaction";
//------------------------------------------------------------

export const fetchTransactions = createAsyncThunk(
  "transaction/fetch",
  async (thunkAPI, { rejectWithValue }) => {
    const response = await fetch("http://localhost:5000/api/v1/transactions");

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

export const fetchTransactionByUser = createAsyncThunk(
  "user/fetch-transaction-by-user",
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
        const response = await fetch(`http://localhost:5000/api/v1/transactions_by_user`, {
          cache: "no-store",
          headers: config.headers,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transaction by user");
        }
  
        const userData = await response.json();
        return userData.data;
      } catch (error) {
        return rejectWithValue(
          (error as Error).message || "Failed to fetch transaction by user"
        );
      }
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/create-transaction",
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
      const response = await API.post("/transaction", formData, config);
      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to create transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transaction/update-transaction",
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
      const response = await API.patch(`/transaction/${id}`, formData, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to update transaction"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transaction/delete-transaction",
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
      const response = await API.delete(`/transaction/${id}`, config);

      if (response.status === 200) {
        const result = await response.data;
        return result;
      }
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || "Failed to delete transaction"
      );
    }
  }
);

type TransactionState = {
  transactions: TransactionValues[];
  searchData: TransactionValues[];
  loading: boolean;
  error: null | any;
};

const initialStateTransaction: TransactionState = {
  transactions: [] as TransactionValues[],
  searchData: [] as TransactionValues[],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: initialStateTransaction,
  reducers: {
    Transaction: (state, action: PayloadAction<TransactionValues[]>) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTransactions.fulfilled,
      (state, action: PayloadAction<TransactionValues[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchTransactionByUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTransactionByUser.fulfilled,
      (state, action: PayloadAction<TransactionValues[]>) => {
        state.loading = false;
        state.transactions = action.payload;
      }
    );
    builder.addCase(fetchTransactionByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(createTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        state.transactions.push(action.payload);
      }
    );
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(updateTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        state.transactions = state.transactions.map((element: any) =>
          element.id === action.payload.id ? action.payload : element
        );
      }
    );
    builder.addCase(updateTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteTransaction.fulfilled,
      (state, action: PayloadAction<TransactionValues>) => {
        state.loading = false;
        const { id } = action.payload;
        if (id) {
          state.transactions = state.transactions.filter(
            (element: any) => element.id !== id
          );
        }
      }
    );
    builder.addCase(deleteTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { Transaction } = transactionSlice.actions;
export default transactionSlice.reducer;
