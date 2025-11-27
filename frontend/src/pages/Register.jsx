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

    // Validar nombre
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El nombre es requerido';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.password2) {
      newErrors.password2 = 'Confirma tu contraseña';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
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
        email: formData.email.trim(),
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name.trim(),
        last_name: '' // Campo opcional
      };

      console.log('Datos a enviar:', userData);

      const result = await register(userData);
      
      console.log('Registro exitoso:', result);
      
      // Navegar al dashboard
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);

    } catch (err) {
      console.error('Error de registro:', err);
      
      if (err.response?.data) {
        const serverErrors = err.response.data;
        
        // Mapear errores del servidor
        const mappedErrors = {};
        
        if (serverErrors.email) {
          mappedErrors.email = Array.isArray(serverErrors.email) 
            ? serverErrors.email[0] 
            : serverErrors.email;
        }
        
        if (serverErrors.username) {
          mappedErrors.username = Array.isArray(serverErrors.username) 
            ? serverErrors.username[0] 
            : serverErrors.username;
        }
        
        if (serverErrors.password) {
          mappedErrors.password = Array.isArray(serverErrors.password) 
            ? serverErrors.password[0] 
            : serverErrors.password;
        }
        
        if (serverErrors.password2 || serverErrors.password_confirm) {
          mappedErrors.password2 = Array.isArray(serverErrors.password2) 
            ? serverErrors.password2[0] 
            : serverErrors.password2 || serverErrors.password_confirm;
        }
        
        if (serverErrors.first_name) {
          mappedErrors.first_name = Array.isArray(serverErrors.first_name) 
            ? serverErrors.first_name[0] 
            : serverErrors.first_name;
        }
        
        // Error general
        if (serverErrors.detail || serverErrors.error || serverErrors.message) {
          mappedErrors.general = serverErrors.detail || serverErrors.error || serverErrors.message;
        }
        
        // Si no hay errores específicos, mostrar error general
        if (Object.keys(mappedErrors).length === 0) {
          mappedErrors.general = 'Error al registrar usuario. Intenta nuevamente.';
        }
        
        setErrors(mappedErrors);
      } else {
        setErrors({ 
          general: 'Error de conexión. Verifica tu conexión a internet.' 
        });
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

        {/* Subtitle */}
        <p className="auth-subtitle">
          Crea tu cuenta para empezar a acumular puntos por tus acciones ecológicas.
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
              placeholder="Tu nombre completo"
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
              placeholder="Tu correo electrónico"
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