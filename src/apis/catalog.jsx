import api from "./index";

export const fetchDepartments = async () => {
  const res = await api.get("/catalog/departments");
  // expected { success, message, data: Department[] }
  return res.data;
};

export const fetchProgramsByDepartment = async (departmentId) => {
  if (!departmentId) throw new Error("departmentId is required");
  const res = await api.get(`/catalog/programs/${departmentId}`);
  // expected { success, message, data: Program[] }
  return res.data;
};





