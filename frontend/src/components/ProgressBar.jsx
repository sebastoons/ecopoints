import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  current, 
  total, 
  label, 
  color = '#4CAF50',
  showPercentage = true,
  height = '12px'
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="progress-container">
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showPercentage && (
            <span className="progress-percentage">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="progress-bar-wrapper" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        >
          <div className="progress-bar-shine"></div>
        </div>
      </div>
      {!label && showPercentage && (
        <div className="progress-text">
          {current} / {total}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;