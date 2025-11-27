import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Registrar usuario
  register: async (userData) => {
    try {
      // Generar username único basado en el email
      const username = userData.email.split('@')[0] + '_' + Date.now().toString().slice(-4);
      
      const dataToSend = {
        ...userData,
        username: username
      };
      
      console.log('Datos a enviar para registro:', dataToSend);
      
      const response = await api.post('/usuarios/registro/', dataToSend);
      
      // Verificar que vengan los tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error.response?.data);
      throw error;
    }
  },

  // Iniciar sesión
  login: async (credentials) => {
    try {
      console.log('Intentando login con email:', credentials.email);
      
      // Enviar email en lugar de username
      const dataToSend = {
        email: credentials.email,
        password: credentials.password
      };
      
      console.log('Datos a enviar para login:', dataToSend);
      
      const response = await api.post('/usuarios/login/', dataToSend);
      
      // Verificar que vengan los tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
        console.log('Tokens guardados correctamente');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data);
      throw error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Limpiar cualquier otro dato del usuario
    localStorage.clear();
  },

  // Obtener usuario actual del token
  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Error decodificando token:', error);
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
      const isValid = decoded.exp * 1000 > Date.now();
      
      // Si el token expiró, limpiar todo
      if (!isValid) {
        authService.logout();
      }
      
      return isValid;
    } catch (error) {
      console.error('Error validando token:', error);
      authService.logout();
      return false;
    }
  },

  // Obtener perfil completo
  getProfile: async () => {
    try {
      const response = await api.get('/usuarios/perfil/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      // Si falla obtener perfil, limpiar sesión
      if (error.response?.status === 401) {
        authService.logout();
      }
      throw error;
    }
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    try {
      const response = await api.put('/usuarios/perfil/editar/', data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },
};

export default authService;