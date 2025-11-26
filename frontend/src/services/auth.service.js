/* eslint-disable no-unused-vars */
import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/usuarios/registro/', userData);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  // Iniciar sesión
  login: async (credentials) => {
    const response = await api.post('/usuarios/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Obtener usuario actual del token
  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      // Verificar si el token expiró
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  },

  // Obtener perfil completo
  getProfile: async () => {
    const response = await api.get('/usuarios/perfil/');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    const response = await api.put('/usuarios/perfil/editar/', data);
    return response.data;
  },
};

export default authService;