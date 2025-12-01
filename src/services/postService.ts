import api from './api';
import { Post, Comment } from '../types';

export const postService = {
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/api/posts');
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`/api/posts/${id}`);
    return response.data;
  },

  getPostComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/api/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId: string, commentData: { full_name: string; comment: string }): Promise<Comment> => {
    const response = await api.post<Comment>(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  },

  createPost: async (postData: FormData): Promise<Post> => {
    const response = await api.post<Post>('/api/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};