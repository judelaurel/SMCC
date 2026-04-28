export interface IPost {
  id: number;
  brandId: number;
  createdBy: number;
  title: string;
  content: string;
  state: 'draft' | 'scheduled' | 'completed' | 'archived';
  isAiGenerated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContentTag {
  id: number;
  postId: number;
  tag: string;
}

export interface ICreatePost {
  brandId: number;
  title: string;
  content: string;
  state?: 'draft' | 'completed' | 'archived';
  isAiGenerated?: boolean;
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  state?: 'draft' | 'scheduled' | 'completed' | 'archived';
  isAiGenerated?: boolean;
}
