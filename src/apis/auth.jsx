import api from "./index";

export const signup = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const saveOnboarding = async (data) => {
  const res = await api.post("/auth/onboard", data);
  return res.data;
};

export const verifyAuth = async () => {
  const res = await api.get("/auth/verify");
  return res.data;
};
