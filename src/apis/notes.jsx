import api from "./index";

// GET all notes for a course
export const getNotes = async (courseCode) => {
  const res = await api.get(`/courses/${courseCode}/notes`);
  return res.data;
};

// UPLOAD a new note
export const uploadNote = async (courseCode, data) => {
  const res = await api.post(`/courses/${courseCode}/notes`, data);
  return res.data;
};
