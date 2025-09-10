import { create } from "zustand";
import createAuthSlice from "./slices/auth";
import { devtools } from "zustand/middleware";
import { createOnboardingSlice } from "./slices/onboarding";
import createGpaCalculatorSlice from "./slices/gpa-calculator";

const useStore = create(
  devtools(
    (set, get) => ({
      ...createAuthSlice(set, get),
      ...createOnboardingSlice(set, get),
      ...createGpaCalculatorSlice(set, get),
    }),
    { name: "Store" }
  )
);

export default useStore;
