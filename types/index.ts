export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  authorId: number;
  categoryId?: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  postId: number;
  status: 'pending' | 'approved' | 'spam';
  createdAt: Date;
  post?: Post;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface PostTag {
  id: number;
  postId: number;
  tagId: number;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalCategories: number;
  totalTags: number;
} 