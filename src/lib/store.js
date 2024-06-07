import { configureStore } from "@reduxjs/toolkit";
// import counterSlice from "./features/counter/counterSlice";
import transactionsSlice from "./features/transactions/transactionsSlice";
import categorySlice from "./features/transactions/categories/categorySlice";

// Creates a store instance per request. Encapsulates the store config to create unique store instances, which is important for SSR, where separate store instances are needed for each request to prevent cross-request state pollution
export const makeStore = () => {
  return configureStore({
    // reducer: { counter: counterSlice },
    reducer: { transactions: transactionsSlice, categories: categorySlice },
    // Adding the api middleware enables caching, invalidation, polling, and other useful features of rtk-query
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(); // Add any apiSlice.middleware here
    },
  });
};
