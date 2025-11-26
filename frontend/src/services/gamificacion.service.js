import api from './api';

const gamificacionService = {
  // Obtener ranking global de usuarios
  getRanking: async (params = {}) => {
    const response = await api.get('/usuarios/ranking/', { params });
    return response.data;
  },

  // Obtener todos los logros disponibles
  getLogros: async () => {
    const response = await api.get('/logros/');
    return response.data;
  },

  // Obtener logros del usuario actual
  getMisLogros: async () => {
    const response = await api.get('/logros/mis-logros/');
    return response.data;
  },

  // Obtener grupos disponibles
  getGrupos: async () => {
    const response = await api.get('/grupos/');
    return response.data;
  },

  // Unirse a un grupo
  unirseGrupo: async (grupoId) => {
    const response = await api.post(`/grupos/${grupoId}/unirse/`);
    return response.data;
  },

  // Salir de un grupo
  salirGrupo: async (grupoId) => {
    const response = await api.post(`/grupos/${grupoId}/salir/`);
    return response.data;
  },
};

export default gamificacionService;