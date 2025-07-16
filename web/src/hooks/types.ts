import { AxiosError } from "axios";

// --- Auth Types ---
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: User;
};

export type RegisterRequest = FormData | {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone?: string;
  dob?: string;
  nic?: string;
  avatar?: File;
};

export type RegisterResponse = {
  data: string; // user._id
};

export type User = {
  _id: string;
  name: string;
  email: string;
  location?: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  createdAt: string;
  updatedAt: string;
};

type ApiErrorResponse = {
  message: string;
  error: number;
  statusCode: string;
};

export type ApiError = AxiosError<ApiErrorResponse>;

// --- Skill Types for API ---
export type SkillRequest = {
  name?: string;
  category?: string;
  proficiency?: number;
  type?: 'teaching' | 'learning';
  agenda?: string[];
  description?: string;
  experience?: string;
  goals?: string;
};

export type SkillResponse = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  type: 'teaching' | 'learning';
  agenda?: string[];
  description?: string;
  experience?: string;
  goals?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};
