import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { AUTH_STORAGE_KEYS } from '../config/appConstants';
import { apiFetch, apiRequest, ApiError } from '../services/apiClient';

const AuthContext = createContext(null);

const TOKEN_KEY = AUTH_STORAGE_KEYS.token;
const SESSION_KEY = AUTH_STORAGE_KEYS.session;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const clearAuth = useCallback((redirectReason) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    clearTimeout(refreshTimerRef.current);

    if (redirectReason && !window.location.pathname.includes('/admin/login')) {
      window.location.href = `/admin/login?reason=${redirectReason}`;
    }
  }, []);

  const refreshSessionToken = useCallback(async () => {
    const sessionToken = localStorage.getItem(SESSION_KEY);
    if (!sessionToken) {
      return null;
    }

    try {
      const data = await apiFetch('POST', API_ENDPOINTS.auth.refresh, { session_token: sessionToken });
      localStorage.setItem(TOKEN_KEY, data.token);
      return data.token;
    } catch (error) {
      if (error instanceof ApiError) {
        const reason = error.data?.code === 'SESSION_IDLE' ? 'idle_timeout' : 'session_expired';
        clearAuth(reason);
      } else {
        clearAuth('session_expired');
      }
      return null;
    }
  }, [clearAuth]);

  const scheduleRefresh = useCallback((jwtToken) => {
    clearTimeout(refreshTimerRef.current);

    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const msUntilExpiry = expiresAt - now;
      const refreshIn = Math.max(msUntilExpiry - 60000, 10000);

      refreshTimerRef.current = setTimeout(async () => {
        const newToken = await refreshSessionToken();
        if (newToken) {
          scheduleRefresh(newToken);
          return;
        }

        // Network issues fallback: retry after 30s when session key still exists.
        if (localStorage.getItem(SESSION_KEY)) {
          refreshTimerRef.current = setTimeout(() => scheduleRefresh(jwtToken), 30000);
        }
      }, refreshIn);
    } catch {
      clearAuth('session_expired');
    }
  }, [clearAuth, refreshSessionToken]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { response, data } = await apiRequest('GET', API_ENDPOINTS.auth.me, null, {
          token,
          throwOnError: false,
        });

        if (response.ok) {
          setUser(data.user);
          scheduleRefresh(token);
          return;
        }

        if (data?.code === 'TOKEN_EXPIRED') {
          const newToken = await refreshSessionToken();
          if (!newToken) {
            return;
          }

          const profile = await apiFetch('GET', API_ENDPOINTS.auth.me, null, { token: newToken });
          setUser(profile.user);
          scheduleRefresh(newToken);
          return;
        }

        clearAuth('session_expired');
      } catch {
        clearAuth(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => clearTimeout(refreshTimerRef.current);
  }, [clearAuth, refreshSessionToken, scheduleRefresh]);

  const login = useCallback((userData, token, sessionToken) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (sessionToken) {
      localStorage.setItem(SESSION_KEY, sessionToken);
    }
    setUser(userData);
    scheduleRefresh(token);
  }, [scheduleRefresh]);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await apiRequest('POST', API_ENDPOINTS.auth.logout, null, { token, throwOnError: false });
      } catch {
        // Ignore logout network issues.
      }
    }

    clearAuth(null);
  }, [clearAuth]);

  const authFetch = useCallback(async (method, path, body, isForm = false) => {
    const currentToken = localStorage.getItem(TOKEN_KEY);

    try {
      return await apiFetch(method, path, body, {
        token: currentToken,
        isFormData: isForm,
      });
    } catch (error) {
      const tokenExpired = error instanceof ApiError
        && error.status === 401
        && error.data?.code === 'TOKEN_EXPIRED';

      if (!tokenExpired) {
        if (error instanceof ApiError && error.status === 401) {
          clearAuth('session_expired');
        }
        throw new Error(error.message || 'Request failed');
      }

      const newToken = await refreshSessionToken();
      if (!newToken) {
        throw new Error('Session expired');
      }

      scheduleRefresh(newToken);
      return apiFetch(method, path, body, {
        token: newToken,
        isFormData: isForm,
      });
    }
  }, [clearAuth, refreshSessionToken, scheduleRefresh]);

  const canManageContent = ['admin', 'editor'].includes(user?.role);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      authFetch,
      isAdmin: canManageContent,
      canManageContent,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
