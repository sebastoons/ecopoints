import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './TaskCard.css';

const TaskCard = ({ tarea }) => {
  const getDifficultyColor = (dificultad) => {
    const colors = {
      'facil': '#4CAF50',
      'medio': '#FF9800',
      'dificil': '#F44336'
    };
    return colors[dificultad?.toLowerCase()] || '#4CAF50';
  };

  const getDifficultyLabel = (dificultad) => {
    const labels = {
      'facil': 'Fácil',
      'medio': 'Medio',
      'dificil': 'Difícil'
    };
    return labels[dificultad?.toLowerCase()] || dificultad;
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-icon" style={{ backgroundColor: getDifficultyColor(tarea.tipo_tarea?.dificultad) }}>
          {tarea.tipo_tarea?.icono || '🌱'}
        </div>
        <div className="task-info">
          <h4 className="task-title">{tarea.tipo_tarea?.nombre}</h4>
          <span 
            className="task-difficulty"
            style={{ color: getDifficultyColor(tarea.tipo_tarea?.dificultad) }}
          >
            {getDifficultyLabel(tarea.tipo_tarea?.dificultad)}
          </span>
        </div>
      </div>

      <div className="task-details">
        <div className="task-detail-item">
          <span className="detail-label">Cantidad:</span>
          <span className="detail-value">{tarea.cantidad} {tarea.tipo_tarea?.unidad_medida}</span>
        </div>
        <div className="task-detail-item">
          <span className="detail-label">Puntos:</span>
          <span className="detail-value points">+{tarea.puntos_ganados}</span>
        </div>
        <div className="task-detail-item">
          <span className="detail-label">CO₂:</span>
          <span className="detail-value co2">-{tarea.co2_evitado} kg</span>
        </div>
      </div>

      <div className="task-footer">
        <span className="task-date">
          {format(new Date(tarea.fecha_registro), "d 'de' MMMM, HH:mm", { locale: es })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;