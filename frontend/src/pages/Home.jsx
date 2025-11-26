import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌱 EcoPoints</h1>
      <p>Bienvenido, {user?.username || 'Usuario'}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Home;