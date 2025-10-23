import api from "./index";

// UPLOAD a new resource (FormData)
export const uploadResource = async (formData) => {
  const res = await api.post(`/resource`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
