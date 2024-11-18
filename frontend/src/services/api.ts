import axios from 'axios';
import type { Chat, Message, Users } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Ajouter le token à toutes les requêtes si disponible
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gérer les réponses de l'API
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Rediriger si non authentifié
    }
    return Promise.reject(error);
  }
);

// Services de chat
export const chatService = {
  getChats: () => api.get<Chat[]>('/chats'),
  getMessages: (chatId: string) => api.get<Message[]>(`/chats/${chatId}/messages`),
  sendMessage: (chatId: string, content: string) => 
    api.post<Message>(`/chats/${chatId}/messages`, { content }),
  markAsRead: (chatId: string) => 
    api.put(`/chats/${chatId}/read`),
};

// Services d'authentification
export const authService = {
  login: async (phone: string, password: string) => {
    try {
      const response = await api.post<{ user: Users, token: string }>('/login', { phone, password });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
    }
  },
  register: async (data: { phone: string; password: string; name: string; email: string }) => {
    try {
      const response = await api.post<{ user: Users, token: string }>('/register', data);
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription :', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      localStorage.removeItem('token');
      throw error;
    }
  },
  getUser: async () => {
    try {
      const response = await api.get<{ user: Users }>('/user');
      return response; // Renvoie uniquement l'utilisateur
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      throw error;
    }
  }
};

export default api;
