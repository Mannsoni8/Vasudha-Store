import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vasudha_user')); } catch { return null; }
  });
  const [loading,     setLoading]     = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Revalidate token on mount
  useEffect(() => {
    const token = localStorage.getItem('vasudha_token');
    if (token && !user) {
      authAPI.getProfile()
        .then(({ data }) => setUser(data.user))
        .catch(() => logout())
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  const saveSession = (userData, token) => {
    localStorage.setItem('vasudha_token', token);
    localStorage.setItem('vasudha_user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      saveSession(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🌸`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const login = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      saveSession(data.user, data.token);
      toast.success(`Namaste, ${data.user.name}! 🙏`);
      return { success: true, isAdmin: data.user.role === 'admin' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  // Google OAuth login — receives credential from Google Identity Services
  const googleLogin = useCallback(async ({ googleId, email, name, avatar }) => {
    setLoading(true);
    try {
      const { data } = await authAPI.googleAuth({ googleId, email, name, avatar });
      saveSession(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🌸`);
      return { success: true, isAdmin: data.user.role === 'admin' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vasudha_token');
    localStorage.removeItem('vasudha_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('vasudha_user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, authChecked,
      register, login, googleLogin, logout, updateUser,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
