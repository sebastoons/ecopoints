import React from 'react';
import './StatsCard.css';

const StatsCard = ({ icon, value, label, color = '#4CAF50', subtitle }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stats-content">
        <div className="stats-value" style={{ color }}>
          {value}
        </div>
        <div className="stats-label">{label}</div>
        {subtitle && <div className="stats-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatsCard;