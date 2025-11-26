import api from './api';

const tareasService = {
  // Obtener tipos de tareas disponibles
  getTiposTarea: async () => {
    const response = await api.get('/tipos-tarea/');
    return response.data;
  },

  // Registrar una nueva tarea ecológica
  registrarTarea: async (tareaData) => {
    const response = await api.post('/tareas/', tareaData);
    return response.data;
  },

  // Obtener historial de tareas del usuario
  getMisTareas: async (params = {}) => {
    const response = await api.get('/tareas/', { params });
    return response.data;
  },

  // Obtener estadísticas personales
  getEstadisticas: async () => {
    const response = await api.get('/tareas/estadisticas/');
    return response.data;
  },

  // Obtener tareas recientes (últimas 5)
  getTareasRecientes: async () => {
    const response = await api.get('/tareas/', {
      params: {
        limit: 5,
        ordering: '-fecha_registro'
      }
    });
    return response.data;
  },
};

export default tareasService;