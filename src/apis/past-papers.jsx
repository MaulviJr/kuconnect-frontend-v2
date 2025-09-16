import api from "./index";

// GET all past papers for a course
export const getPastPapers = async (courseCode) => {
  const res = await api.get(`/courses/${courseCode}/past-papers`);
  return res.data;
};

// UPLOAD a new past paper (FormData)
export const uploadPastPaper = async (courseCode, formData) => {
  const res = await api.post(`/courses/${courseCode}/past-papers`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
