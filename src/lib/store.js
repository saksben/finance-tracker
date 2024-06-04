import { combineSlices, configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";

// combineSlices automatically combines the reducers using their reducerPaths, therefore we no longer need to call combineReducers
const rootReducer = combineSlices(counterSlice); // Add slices in the parentheses

// Creates a store instance per request. Encapsulates the store config to create unique store instances, which is important for SSR, where separate store instances are needed for each request to prevent cross-request state pollution
export const makeStore = () => {
  return configureStore({
    reducer: { counter: counterSlice },
    // Adding the api middleware enables caching, invalidation, polling, and other useful features of rtk-query
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(); // Add any apiSlice.middleware here
    },
  });
};
