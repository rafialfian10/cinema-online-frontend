"use client"

// components react
import React from 'react';
import { Provider } from 'react-redux';

// components
import { store } from '@/redux/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
