import api from "./index";

export const signup = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const saveOnboarding = async (data) => {
  const res = await api.post("/auth/onboarding", data);
  return res.data;
};
