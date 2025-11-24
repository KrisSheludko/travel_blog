import api from './api';

export const postService = {
  getPosts: async () => {
    const response = await api.get('/api/posts');
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/api/posts/${id}`);
    return response.data;
  },

  getPostComments: async (postId) => {
    const response = await api.get(`/api/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId, commentData) => {
    const response = await api.post(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  },

  createPost: async (postData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('country', postData.country);
    formData.append('city', postData.city);
    formData.append('photo', postData.photo);

    const response = await api.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id, postData) => {
    const formData = new FormData();
    if (postData.title) formData.append('title', postData.title);
    if (postData.description) formData.append('description', postData.description);
    if (postData.country) formData.append('country', postData.country);
    if (postData.city) formData.append('city', postData.city);
    if (postData.photo) formData.append('photo', postData.photo);

    const response = await api.post(`/api/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/api/posts/${id}`);
    return response.data;
  }
};