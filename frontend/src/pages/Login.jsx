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
    password: ''
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

    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
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
      const result = await login(credentials);

      console.log('Login exitoso:', result);
      
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
          setError(data.error || data.detail || data.message || 'Datos inválidos. Verifica tu información.');
        } else if (status === 404) {
          setError('Usuario no encontrado. Verifica tu email.');
        } else if (status >= 500) {
          setError('Error del servidor. Intenta más tarde.');
        } else {
          setError(data.error || data.detail || data.message || 'Error al iniciar sesión.');
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
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '10px',
            color: '#4CAF50' 
          }}>🌱</div>
          <h1 style={{ 
            color: '#4CAF50', 
            fontSize: '1.8rem', 
            margin: '0 0 10px 0' 
          }}>EcoPoints</h1>
        </div>

        {/* Avatar */}
        <div className="auth-avatar">
          <FaUser />
        </div>

        {/* Título */}
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          color: '#333', 
          marginBottom: '25px' 
        }}>
          Iniciar Sesión
        </h2>

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
              required
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
              required
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
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <Link to="/recuperar-contrasena" className="footer-link">
            ¿Olvidaste tu contraseña?
          </Link>
          <p className="footer-text">
            ¿No tienes cuenta? <Link to="/register" className="link-highlight">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;