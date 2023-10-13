// components redux
import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';

// components
import authSlice from './features/authSlice';

export const store = configureStore({
    reducer: {
        authSlice: authSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;