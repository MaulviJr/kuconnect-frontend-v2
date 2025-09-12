import api from "./index";

export const getCourses = async (department, semester) => {
  try {
    const res = await api.post("/dashboard/courses", { department, semester });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Failed to fetch courses";
  }
};
