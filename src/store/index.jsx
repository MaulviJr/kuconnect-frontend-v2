import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAuthSlice from "./slices/auth";
import createGpaCalculatorSlice from "./slices/gpa-calculator";

const useStore = create(
  devtools(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createGpaCalculatorSlice(set, get),
    }),
    { name: "Store" }
  )
);

export default useStore;
