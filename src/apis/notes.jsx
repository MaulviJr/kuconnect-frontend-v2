import api from "./index";

// GET all notes for a course
export const getNotes = async (courseCode) => {
  const res = await api.get(`/courses/${courseCode}/notes`);
  return res.data;
};

// UPLOAD a new note (FormData)
export const uploadNote = async (courseCode, formData) => {
  const res = await api.post(`/courses/${courseCode}/notes`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
