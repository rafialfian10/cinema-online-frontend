// components redux
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

// features redux
// import { authSlice } from './features/authSlice';
import categorySlice from "./features/categorySlice";
import movieSlice from "./features/movieSlice";
import userSlice from "./features/userSlice.";
import transactionSlice from "./features/transactionSlice";

export const store = configureStore({
  reducer: {
    // auth: authSlice.reducer,
    userSlice: userSlice,
    movieSlice: movieSlice,
    categorySlice: categorySlice,
    transactionSlice: transactionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppDispatch: () => typeof store.dispatch = useDispatch;
