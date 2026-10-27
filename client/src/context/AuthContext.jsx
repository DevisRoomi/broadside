import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('broadside_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user data on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('broadside_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // Login handler
  async function login(email, password) {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Login failed';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      localStorage.setItem('broadside_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true, user: data.data.user };
    } catch (err) {
      const msg = 'Network connection failed';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }

  // Register handler
  async function register(name, email, password, bio) {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, bio }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.message || 'Registration failed';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      localStorage.setItem('broadside_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return { success: true, user: data.data.user };
    } catch (err) {
      const msg = 'Network error during registration';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  }

  // Logout handler
  function logout() {
    localStorage.removeItem('broadside_token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
