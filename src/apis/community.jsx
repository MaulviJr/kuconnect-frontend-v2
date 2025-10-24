import api from "./index";

// POST - Create a new post
export const createPost = async (content) => {
  const res = await api.post("/community/post", { content });
  return res.data;
};

// GET - Fetch posts with pagination and filtering
export const getPosts = async (page = 1, limit = 10, filter = "newest") => {
  const res = await api.get(`/community/post?page=${page}&limit=${limit}&filter=${filter}`);
  return res.data;
};

// GET - Fetch a single post by ID
export const getPostById = async (postId) => {
  const res = await api.get(`/community/post/${postId}`);
  return res.data;
};

// DELETE - Delete a post
export const deletePost = async (postId) => {
  const res = await api.delete(`/community/post/${postId}`);
  return res.data;
};

// POST - Create a comment
export const createComment = async (postId, content) => {
  const res = await api.post("/community/comment", {
    post_id: postId,
    content: content
  });
  return res.data;
};

// GET - Fetch comments for a post
export const getComments = async (postId) => {
  const res = await api.get(`/community/comments/${postId}`);
  return res.data;
};

// DELETE - Delete a comment
export const deleteComment = async (commentId) => {
  const res = await api.delete(`/community/comment/${commentId}`);
  return res.data;
};

// POST - Cast a vote (like/dislike)
export const castVote = async (postId, value, signal = null) => {
  const config = {};
  if (signal) {
    config.signal = signal;
  }
  const res = await api.post("/community/vote", {
    post_id: postId,
    value: value // 1 for like, -1 for dislike
  }, config);
  return res.data;
};
