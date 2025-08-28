import axios from 'axios';
import type { Room, Reservation, User, ApiResponse, PaginatedResponse } from '../types';

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use((config: any) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Méthodes génériques
  private async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.get(url);
    return response.data;
  }

  private async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  private async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  private async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // Méthodes pour les chambres
  async getRooms(page = 1, limit = 10): Promise<PaginatedResponse<Room>> {
    const response = await this.get<PaginatedResponse<Room>>(`/rooms?page=${page}&limit=${limit}`);
    return response.data!;
  }

  async getRoom(id: string): Promise<Room> {
    const response = await this.get<Room>(`/rooms/${id}`);
    return response.data!;
  }

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const response = await this.post<Room>('/rooms', room);
    return response.data!;
  }

  async updateRoom(id: string, room: Partial<Room>): Promise<Room> {
    const response = await this.put<Room>(`/rooms/${id}`, room);
    return response.data!;
  }

  async deleteRoom(id: string): Promise<void> {
    await this.delete<void>(`/rooms/${id}`);
  }

  // Méthodes pour les réservations
  async getReservations(page = 1, limit = 10): Promise<PaginatedResponse<Reservation>> {
    const response = await this.get<PaginatedResponse<Reservation>>(`/reservations?page=${page}&limit=${limit}`);
    return response.data!;
  }

  async getReservation(id: string): Promise<Reservation> {
    const response = await this.get<Reservation>(`/reservations/${id}`);
    return response.data!;
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    const response = await this.post<Reservation>('/reservations', reservation);
    return response.data!;
  }

  async updateReservation(id: string, reservation: Partial<Reservation>): Promise<Reservation> {
    const response = await this.put<Reservation>(`/reservations/${id}`, reservation);
    return response.data!;
  }

  async deleteReservation(id: string): Promise<void> {
    await this.delete<void>(`/reservations/${id}`);
  }

  // Méthodes pour l'authentification
  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await this.post<{ user: User; token: string }>('/auth/login', credentials);
    return response.data!;
  }

  async logout(): Promise<void> {
    await this.post<void>('/auth/logout');
    localStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.get<User>('/auth/me');
    return response.data!;
  }
}

export const apiService = new ApiService();
export default apiService;
