/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Solo intentar cargar perfil si hay token válido
      if (authService.isAuthenticated()) {
        const profile = await authService.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Si falla, limpiar todo sin recargar
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Iniciando login...');
      
      // 1. Primero hacer login
      const data = await authService.login(credentials);
      console.log('AuthContext: Login exitoso, obteniendo perfil...');
      
      // 2. Esperar un momento para que el token se guarde
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Obtener el perfil
      const profile = await authService.getProfile();
      console.log('AuthContext: Perfil obtenido:', profile);
      
      // 4. Actualizar el estado
      setUser(profile);
      
      return data;
    } catch (error) {
      console.error('Error en login (AuthContext):', error);
      // Limpiar tokens si falla
      authService.logout();
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext: Iniciando registro...');
      
      const data = await authService.register(userData);
      console.log('AuthContext: Registro exitoso, obteniendo perfil...');
      
      // Esperar un momento para que el token se guarde
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const profile = await authService.getProfile();
      console.log('AuthContext: Perfil obtenido:', profile);
      
      setUser(profile);
      
      return data;
    } catch (error) {
      console.error('Error en registro (AuthContext):', error);
      authService.logout();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthContext: Cerrando sesión...');
    
    // 1. Limpiar tokens
    authService.logout();
    
    // 2. Limpiar estado
    setUser(null);
    
    // 3. No recargar, solo limpiar
    console.log('AuthContext: Sesión cerrada');
  };

  const updateUser = async (data) => {
    try {
      const updatedProfile = await authService.updateProfile(data);
      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};