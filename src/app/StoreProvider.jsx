"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
// import {initializeCount} from "../lib/features/counter/counterSlice"

// Component will only be rendered once per request on server, but might be re-rendered multiple times on client if any stateful client components above this component in the tree
export const StoreProvider = ({ children }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(initializeCount(count)) // If you need to initialize store with data from counterSlice
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};
