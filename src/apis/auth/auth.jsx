import axiosInstance from "./axiosInstance";

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Error: Couldn't Login The User", error);
    throw error;
  }
};

// Register
export const registerUser = async (name, email, password) => {
  try {
    const response = await axiosInstance.post("/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error: Couldn't Register The User", error);
    throw error;
  }
};
