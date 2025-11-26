import React from 'react';
import './AchievementBadge.css';

const AchievementBadge = ({ logro, small = false }) => {
  return (
    <div className={`achievement-badge ${logro.desbloqueado ? 'unlocked' : 'locked'} ${small ? 'small' : ''}`}>
      <div className="badge-icon">
        {logro.icono || '🏆'}
      </div>
      <div className="badge-info">
        <div className="badge-name">{logro.nombre}</div>
        {!small && <div className="badge-description">{logro.descripcion}</div>}
      </div>
      {logro.desbloqueado && <div className="badge-checkmark">✓</div>}
    </div>
  );
};

export default AchievementBadge;