export interface ISocialAccount {
  id: number;
  userId: number;
  platformId: number;
  providerUserId: string;
  username: string;
  isActive: boolean;
  expiresAt: string | null;
  scope: string | null;
  createdAt: string;
  updatedAt: string | null;
  platform?: {
    id: number;
    platform: string;
    isActive: boolean;
  };
}

export interface IScheduledPost {
  id: number;
  socialAccountId: number;
  postId: number;
  postType: 'text' | 'link' | 'image';
  scheduledAt: string;
  publishedAt: string | null;
  publishStatus: 'pending' | 'processing' | 'posted' | 'failed' | 'cancelled';
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string | null;
  socialAccount?: ISocialAccount;
  post?: {
    id: number;
    title: string;
    content: string;
    state: string;
  };
}

export interface ICreateScheduledPost {
  socialAccountIds: number[];
  postId: number;
  postType?: 'text' | 'link' | 'image';
  scheduledAt: string;
}
