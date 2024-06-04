import { configureStore } from "@reduxjs/toolkit";

// Creates a store instance per request
export const makeStore = () => {
    return configureStore({
        reducer: {}
    })
}