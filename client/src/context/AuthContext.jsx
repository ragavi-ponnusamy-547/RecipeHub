import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    return {
      user: user ? JSON.parse(user) : null,
      token,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState(storedAuth.user);
  const [token, setToken] = useState(storedAuth.token);
  const [loading, setLoading] = useState(Boolean(storedAuth.token));

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    persistAuth(response.token, response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    persistAuth(response.token, response.user);
    return response.user;
  };

  const updateProfile = async (payload) => {
    const response = await authApi.updateProfile(payload);
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  };

  const changePassword = async (payload) => {
    const response = await authApi.changePassword(payload);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
