import * as authApi from "@/apis/auth";
import { success } from "zod";

const createAuthSlice = (set, get) => ({
  auth: {
    isAuthenticated: false,
    user: null,
    courses: [],
    rehydrated: false,
  },

  signup: async (formData) => {
    try {
      const response = await authApi.signup(formData);
      console.log("Signup response:", response);
      if (!response.success) {
        throw new Error("Signup failed");
      }
      // Store user data in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(response.data.user));

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          user: response.data.user,
          rehydrated: true,
        },
      }));
    } catch (err) {
      throw err.response?.data?.error || "Signup failed";
    }
  },

  login: async (credentials) => {
    try {
      const response = await authApi.login(credentials);    
      
      // Store user data in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("courses", JSON.stringify(response.data.courses || []));

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          user: response.data.user,
          courses: response.data.courses || [],
          rehydrated: true,
        },
      }));
    } catch (err) {
      throw err.response?.data?.error || "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("courses");

    set((state) => ({
      auth: {
        ...state.auth,
        isAuthenticated: false,
        user: null,
        courses: [],
        rehydrated: true,
      },
    }));
  },

  rehydrateAuth: async () => {
    try {
      // First check if we have user data in localStorage
      const userRaw = localStorage.getItem("user");
      
      if (userRaw) {
        // Verify the session is still valid with the server
        const response = await authApi.verifyAuth();
        
        if (response.success && response.data.user) {
          // Handle nested user structure: data.user.user
          const userData = response.data.user.user || response.data.user;
          const courses = response.data.courses || [];
          
          console.log("Verify response user:", userData);
          console.log("Verify response courses:", courses);
          
          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("courses", JSON.stringify(courses));
          
          set((state) => ({
            auth: {
              ...state.auth,
              isAuthenticated: true,
              user: userData,
              courses: courses,
              rehydrated: true,
            },
          }));
        } else {
          // Session invalid, clear local data
          localStorage.removeItem("user");
          localStorage.removeItem("courses");
          set((state) => ({
            auth: {
              ...state.auth,
              isAuthenticated: false,
              user: null,
              courses: [],
              rehydrated: true,
            },
          }));
        }
      } else {
        set((state) => ({
          auth: {
            ...state.auth,
            isAuthenticated: false,
            user: null,
            courses: [],
            rehydrated: true,
          },
        }));
      }
    } catch (err) {
      // If verification fails, clear local data and set as not authenticated
      localStorage.removeItem("user");
      localStorage.removeItem("courses");
      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: false,
          user: null,
          courses: [],
          rehydrated: true,
        },
      }));
    }
  },

  saveOnboarding: async (onboardingData) => {
    try {
      const { success, message, data } = await authApi.saveOnboarding(onboardingData);

      console.log("saveOnboarding response:", { success, message, data });
      console.log("User data:", data.user);
      console.log("is_boarded:", data.user?.is_boarded);
      console.log("Courses:", data.courses);

      if (!success) {
        throw new Error("Failed to onboard user");
      }
      
      // Store updated user data and courses in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("courses", JSON.stringify(data.courses || []));

      set((state) => ({
        auth: {
          ...state.auth,
          user: data.user,
          courses: data.courses || [],
          isAuthenticated: true,
          rehydrated: true,
        },
      }));

      console.log("State updated with user:", data.user);
    } catch (err) {
      throw err.response?.data?.error || "Onboarding failed";
    }
  },
});

export default createAuthSlice;
