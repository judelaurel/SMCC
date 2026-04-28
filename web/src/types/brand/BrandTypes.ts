export interface IBrand {
  id: number;
  name: string;
  description: string | null;
  toneOfVoice: 'professional' | 'casual' | 'witty' | 'formal';
  logoUrl: string | null;
  primaryColor: string | null;
  members?: Array<{
    id: number;
    userId: number;
    role: 'owner' | 'admin' | 'member';
  }>;
}

export interface IBrandMember {
  id: number;
  brandId: number;
  userId: number;
  role: 'owner' | 'admin' | 'member';
  addedBy: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface ICreateBrand {
  name: string;
  description?: string;
  toneOfVoice: 'professional' | 'casual' | 'witty' | 'formal';
  logoUrl?: string;
  primaryColor?: string;
}

export interface IUpdateBrand {
  name?: string;
  description?: string;
  toneOfVoice?: 'professional' | 'casual' | 'witty' | 'formal';
  logoUrl?: string;
  primaryColor?: string;
}

export interface ICreateBrandMember {
  userId: number;
  role: 'admin' | 'member';
}

export interface IUpdateBrandMember {
  role: 'admin' | 'member';
}
