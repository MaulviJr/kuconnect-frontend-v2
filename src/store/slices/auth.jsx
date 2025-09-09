import * as api from "@/services/api";

const createAuthSlice = (set, get) => ({
  auth: {
    isAuthenticated: false,
    token: null,
    user: null,
    rehydrated: false,
  },

  signup: async (formData) => {
    try {
      const { token, user } = await api.signup(formData);

      // persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        auth: {
          isAuthenticated: true,
          token,
          user,
          rehydrated: true,
        },
      });
    } catch (err) {
      throw err.message || "Signup failed";
    }
  },

  login: async (credentials) => {
    try {
      const { token, user } = await api.login(credentials);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        auth: {
          isAuthenticated: true,
          token,
          user,
          rehydrated: true,
        },
      });
    } catch (err) {
      throw err.message || "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      auth: {
        isAuthenticated: false,
        token: null,
        user: null,
        rehydrated: true,
      },
    });
  },

  rehydrateAuth: () => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      set({
        auth: {
          isAuthenticated: true,
          token,
          user: JSON.parse(userRaw),
          rehydrated: true,
        },
      });
    } else {
      set({
        auth: {
          isAuthenticated: false,
          token: null,
          user: null,
          rehydrated: true,
        },
      });
    }
  },
});

export default createAuthSlice;
