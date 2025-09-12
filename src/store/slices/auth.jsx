import * as authApi from "@/apis/auth";

const createAuthSlice = (set, get) => ({
  auth: {
    isAuthenticated: false,
    token: null,
    user: null,
    rehydrated: false,
  },

  signup: async (formData) => {
    try {
      const { token, user } = await authApi.signup(formData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          token,
          user,
          rehydrated: true,
        },
      }));
    } catch (err) {
      throw err.response?.data?.error || "Signup failed";
    }
  },

  login: async (credentials) => {
    try {
      const { token, user } = await authApi.login(credentials);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          token,
          user,
          rehydrated: true,
        },
      }));
    } catch (err) {
      throw err.response?.data?.error || "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set((state) => ({
      auth: {
        ...state.auth,
        isAuthenticated: false,
        token: null,
        user: null,
        rehydrated: true,
      },
    }));
  },

  rehydrateAuth: () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: true,
          token,
          user: JSON.parse(userRaw),
          rehydrated: true,
        },
      }));
    } else {
      set((state) => ({
        auth: {
          ...state.auth,
          isAuthenticated: false,
          token: null,
          user: null,
          rehydrated: true,
        },
      }));
    }
  },
});

export default createAuthSlice;
