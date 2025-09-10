export const createOnboardingSlice = (set) => ({
  onboarding: {
    department: "",
    semester: "",
    completed: false,
    rehydrated: false,
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
    set((state) => {
      const updated = {
        ...state.onboarding,
        completed: true,
      };
      localStorage.setItem("onboarding", JSON.stringify(updated));
      return { onboarding: updated };
    }),

  resetOnboarding: () => {
    localStorage.removeItem("onboarding");
    return set(() => ({
      onboarding: {
        department: "",
        semester: "",
        completed: false,
        rehydrated: true,
      },
    }));
  },

  rehydrateOnboarding: () => {
    const raw = localStorage.getItem("onboarding");
    if (raw) {
      set({
        onboarding: { ...JSON.parse(raw), rehydrated: true },
      });
    } else {
      set({
        onboarding: {
          department: "",
          semester: "",
          completed: false,
          rehydrated: true,
        },
      });
    }
  },
});
