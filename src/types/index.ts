export interface User {
  id: number;
  email: string;
  full_name: string;
  city?: string;
  country?: string;
  bio?: string;
  photo?: string;
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  description: string;
  country: string;
  city: string;
  photo: string;
  comments: Comment[];
  userInfo: {
    full_name: string;
    city: string;
    bio: string;
  };
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  comment: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreatePostFormData {
  title: string;
  description: string;
  country: string;
  city: string;
  photo: File;
}

export interface CreateCommentFormData {
  full_name: string;
  comment: string;
}

export interface ProfileFormData {
  full_name: string;
  city: string;
  bio: string;
  password: string;
  confirmPassword: string;
}