import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    console.log('Header: Iniciando logout...');
    
    // 1. Llamar al logout del contexto
    logout();
    
    // 2. Esperar un momento y navegar al login
    setTimeout(() => {
      console.log('Header: Navegando a login...');
      navigate('/login', { replace: true });
    }, 100);
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return 'U';
    const name = user.nombre || user.email || 'Usuario';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo" onClick={handleLogoClick}>
          <img src="/logo-dashboard.png" alt="EcoPoints" />
        </div>

        {/* Título y subtítulo */}
        <div className="header-info">
          {title && <h1 className="header-title">{title}</h1>}
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>

        {/* Usuario y logout */}
        <div className="header-user">
          <div className="user-info">
            <div className="user-avatar">
              {getInitials()}
            </div>
            <span className="user-name">
              {user?.nombre || user?.email || 'Usuario'}
            </span>
          </div>
          
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;