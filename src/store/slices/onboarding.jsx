export const createOnboardingSlice = (set) => ({
  onboarding: {
    department: "",
    semester: "",
    completed: false,
  },

  setDepartment: (department) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        department,
      },
    })),
  setSemester: (semester) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        semester,
      },
    })),
  completeOnboarding: () =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        completed: true,
      },
    })),
  resetOnboarding: () =>
    set(() => ({
      onboarding: {
        department: "",
        semester: "",
        completed: false,
      },
    })),
});
