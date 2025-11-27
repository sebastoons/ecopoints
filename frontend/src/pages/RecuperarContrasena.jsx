import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import './Login.css';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setEmail('');
    } catch {
      setError('Error al enviar el código. Por favor intenta nuevamente.');
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

        {/* Título */}
        <h2 className="recovery-title">Recuperar Contraseña</h2>

        {/* Descripción */}
        <p className="recovery-description">
          Ingrese su correo electrónico asociado a la cuenta para enviarle una contraseña temporal o código de acceso.
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✓ Código enviado exitosamente. Revisa tu correo electrónico.
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
              disabled={loading}
            />
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Código de Acceso'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-footer">
          <Link to="/login" className="footer-link">
            ¿Recordaste tu contraseña? <span className="link-highlight">Volver al inicio de sesión</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;