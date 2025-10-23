import api from "./index";

// GET all videos for a course
export const getVideos = async (courseId) => {
  const res = await api.get(`/resource?course_id=${courseId}&type=video`);
  return res.data;
};

// UPLOAD a new resource (FormData) - Legacy function for backward compatibility
export const uploadVideo = async (courseCode, formData) => {
  const res = await api.post(`/resource`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
