import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user' // 'admin' o 'user'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario escribe
    if (error) setError('');
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      // Preparar credenciales para el backend
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
      };

      console.log('Intentando login con:', credentials.email);

      // Llamar al servicio de login
      await login(credentials);

      console.log('Login exitoso, redirigiendo...');
      
      // Esperar un momento antes de navegar
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } catch (err) {
      console.error('Error en login:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        // Error de respuesta del servidor
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (status === 400) {
          setError(data.detail || data.message || 'Datos inválidos. Verifica tu información.');
        } else if (status === 404) {
          setError('Usuario no encontrado.');
        } else if (status >= 500) {
          setError('Error del servidor. Intenta más tarde.');
        } else {
          setError(data.detail || data.message || 'Error al iniciar sesión.');
        }
      } else if (err.request) {
        // Error de red
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Otros errores
        setError('Error inesperado. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo-auth.png" alt="EcoPoints" />
        </div>

        {/* Avatar */}
        <div className="auth-avatar">
          <FaUser />
        </div>

        {/* Título */}
        <h2 className="auth-title">Iniciar Sesión</h2>

        {/* Selector de tipo de usuario */}
        <div className="login-type-selector">
          <button
            type="button"
            className={`type-btn ${formData.userType === 'admin' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('admin')}
          >
            Administrador
          </button>
          <button
            type="button"
            className={`type-btn ${formData.userType === 'user' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('user')}
          >
            Usuario
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Botón de login */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {/* Enlaces */}
          <div className="auth-links">
            <Link to="/recuperar-contrasena" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="auth-separator">|</div>
            <Link to="/register" className="auth-link">
              Registrarse
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;