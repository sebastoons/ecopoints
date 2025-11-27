import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
    password2: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre completo es requerido';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: ''
      };

      await register(userData);
      navigate('/');
    } catch (err) {
      console.error('Error de registro:', err);
      setErrors(
        err.response?.data || 
        { general: 'Error al registrar usuario. Intenta nuevamente.' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo - Coloca tu logo en public/logo-auth.png */}
        <div className="auth-logo">
          <img src="/logo-auth.png" alt="EcoPoints" />
        </div>

        {/* Subtitle */}
        <p className="auth-subtitle">
          Crea tu cuenta para empezar a reciclar y ganar puntos.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          {/* Nombre Completo */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Introduce tu nombre"
              required
              disabled={loading}
            />
          </div>
          {errors.first_name && <span className="field-error">{errors.first_name}</span>}

          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Introduce tu correo"
              required
              disabled={loading}
            />
          </div>
          {errors.email && <span className="field-error">{errors.email}</span>}

          {/* Contraseña */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña"
              required
              disabled={loading}
            />
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}

          {/* Confirmar Contraseña */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
              disabled={loading}
            />
          </div>
          {errors.password2 && <span className="field-error">{errors.password2}</span>}

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <p className="footer-text">
            ¿Ya tienes una cuenta? <Link to="/login" className="link-highlight">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;