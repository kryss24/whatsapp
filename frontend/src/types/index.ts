export interface Message {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  type: string;
  created_at: Date;
  updated_at: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  users: any;
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
}

export interface Users {
  id: string;
  name: string;
  avatar: string;
  status: string;
  phone?: string;
  email?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthResponse {
  user: Users;
  token: string;
}