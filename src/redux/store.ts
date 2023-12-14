// components redux
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

// features redux
import categorySlice from "./features/categorySlice";
// import { authSlice } from './features/authSlice';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    // auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppDispatch: () => typeof store.dispatch = useDispatch;
