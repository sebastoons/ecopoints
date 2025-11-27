import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import tareasService from '../services/tareas.service';
import gamificacionService from '../services/gamificacion.service';
import StatsCard from '../components/StatsCard';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import AchievementBadge from '../components/AchievementBadge';
import { 
  FaTrophy, 
  FaLeaf, 
  FaStar, 
  FaPlus, 
  FaChevronRight
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [tareasRecientes, setTareasRecientes] = useState([]);
  const [logrosRecientes, setLogrosRecientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsData, tareasData, logrosData] = await Promise.all([
        tareasService.getEstadisticas(),
        tareasService.getTareasRecientes(),
        gamificacionService.getMisLogros()
      ]);

      setEstadisticas(statsData);
      setTareasRecientes(tareasData.results || tareasData);
      
      const logrosDesbloqueados = (logrosData.results || logrosData)
        .filter(l => l.desbloqueado)
        .slice(0, 3);
      setLogrosRecientes(logrosDesbloqueados);

    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calcularProgresoNivel = () => {
    if (!estadisticas?.nivel_actual || !estadisticas?.puntos_totales) {
      return { current: 0, total: 100 };
    }

    const nivel = estadisticas.nivel_actual;
    const puntosParaSiguienteNivel = nivel * 1000;
    const puntosNivelAnterior = (nivel - 1) * 1000;
    const puntosEnNivelActual = estadisticas.puntos_totales - puntosNivelAnterior;

    return {
      current: puntosEnNivelActual,
      total: puntosParaSiguienteNivel - puntosNivelAnterior
    };
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  const progresoNivel = calcularProgresoNivel();

  return (
    <div className="home-container">
      {/* Header con Logo de Dashboard */}
      <Header 
        title={`Hola, ${user?.first_name || user?.username}! 👋`}
        subtitle="Tus Logros Ecológicos"
      />

      {/* Main Content */}
      <main className="home-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={loadDashboardData}>Reintentar</button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatsCard
              icon={<FaTrophy />}
              value={estadisticas?.puntos_totales || 0}
              label="Puntos Planeta"
              color="#FFD700"
            />
            <StatsCard
              icon={<FaLeaf />}
              value={`${estadisticas?.co2_total_evitado || 0} kg`}
              label="CO₂ Evitado"
              color="#4CAF50"
            />
          </div>
        </section>

        {/* Nivel y Progreso */}
        <section className="level-section">
          <div className="level-card">
            <div className="level-header">
              <div className="level-badge">
                <FaStar />
                <span>Nivel {estadisticas?.nivel_actual || 1}</span>
              </div>
              <span className="level-subtitle">Eco-Guerrero</span>
            </div>
            <ProgressBar
              current={progresoNivel.current}
              total={progresoNivel.total}
              label="Progreso del Mes"
              color="#4CAF50"
              height="16px"
            />
            <div className="level-footer">
              <span>{progresoNivel.total - progresoNivel.current} puntos para el siguiente nivel</span>
            </div>
          </div>
        </section>

        {/* Botón Nueva Tarea */}
        <section className="quick-action">
          <button 
            className="btn-new-task"
            onClick={() => navigate('/tareas')}
          >
            <FaPlus />
            <span>Registrar Nueva Tarea</span>
          </button>
        </section>

        {/* Impacto Semanal */}
        <section className="impact-section">
          <div className="section-header">
            <h2 className="section-title">Impacto Semanal</h2>
          </div>
          <div className="chart-card">
            <div className="chart-placeholder">
              <p>📊 Gráfico de impacto semanal</p>
              <small>(Próximamente con Chart.js)</small>
            </div>
          </div>
        </section>

        {/* Tareas Recientes */}
        <section className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Tareas Pendientes</h2>
            <button 
              className="btn-view-all"
              onClick={() => navigate('/tareas')}
            >
              Ver todas <FaChevronRight />
            </button>
          </div>
          <div className="tasks-list">
            {tareasRecientes.length > 0 ? (
              tareasRecientes.map((tarea) => (
                <TaskCard key={tarea.id} tarea={tarea} />
              ))
            ) : (
              <div className="empty-state">
                <FaLeaf size={48} color="#ccc" />
                <p>No tienes tareas registradas aún</p>
                <button 
                  className="btn-primary-small"
                  onClick={() => navigate('/tareas')}
                >
                  Registrar primera tarea
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Logros Recientes */}
        {logrosRecientes.length > 0 && (
          <section className="achievements-section">
            <div className="section-header">
              <h2 className="section-title">Logros Recientes</h2>
              <button 
                className="btn-view-all"
                onClick={() => navigate('/logros')}
              >
                Ver todos <FaChevronRight />
              </button>
            </div>
            <div className="achievements-grid">
              {logrosRecientes.map((logro) => (
                <AchievementBadge key={logro.id} logro={logro} small />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate('/')}>
          <FaLeaf />
          <span>Inicio</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/tareas')}>
          <FaPlus />
          <span>Tareas</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/ranking')}>
          <FaTrophy />
          <span>Ranking</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <FaStar />
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;