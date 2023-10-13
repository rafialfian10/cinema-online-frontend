import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: AuthState;
};

type AuthState = {
    isAuth: boolean,
    user: any,
};

const initialState = {
    value: {
        isAuth: false,
        user: {},
    } as AuthState,
} as InitialState;

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: () => {
            localStorage.removeItem("token");
            return initialState;
        },
        logIn: (state, action: PayloadAction<any>) => {
            const { type, payload } = action;
            localStorage.setItem("token", JSON.stringify(payload.payload.token));

            return {
                value: { 
                    isAuth: true,
                    user: payload.payload, // payload berisi semua data user
                },
            };
        },
    },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;


