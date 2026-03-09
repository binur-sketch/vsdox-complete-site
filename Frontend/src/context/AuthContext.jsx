import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../config';

const TOKEN_KEY       = 'vsdox_token';
const SESSION_KEY     = 'vsdox_session';   // opaque session_token for refresh

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshTimerRef       = useRef(null);  // holds the auto-refresh setTimeout id

    // ── Clear all auth state ───────────────────────────────────────────
    const clearAuth = useCallback((redirectReason) => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        clearTimeout(refreshTimerRef.current);
        if (redirectReason && !window.location.pathname.includes('/admin/login')) {
            window.location.href = `/admin/login?reason=${redirectReason}`;
        }
    }, []);

    // ── Schedule a silent JWT refresh before it expires ───────────────
    // jwtToken: the current JWT string (contains exp claim)
    const scheduleRefresh = useCallback((jwtToken) => {
        clearTimeout(refreshTimerRef.current);
        try {
            // Decode payload (no verify — server already verified it)
            const payload  = JSON.parse(atob(jwtToken.split('.')[1]));
            const expiresAt = payload.exp * 1000;          // ms timestamp
            const now       = Date.now();
            const msUntilExpiry = expiresAt - now;
            // Refresh 60 seconds before expiry (or immediately if < 10s left)
            const refreshIn = Math.max(msUntilExpiry - 60_000, 10_000);

            refreshTimerRef.current = setTimeout(async () => {
                const sessionToken = localStorage.getItem(SESSION_KEY);
                if (!sessionToken) { clearAuth('session_expired'); return; }

                try {
                    const res  = await fetch(`${API}/auth/refresh`, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ session_token: sessionToken }),
                    });
                    const data = await res.json();

                    if (res.ok) {
                        // Store new JWT and schedule the next refresh cycle
                        localStorage.setItem(TOKEN_KEY, data.token);
                        scheduleRefresh(data.token);
                    } else {
                        // SESSION_IDLE, SESSION_EXPIRED, SESSION_NOT_FOUND
                        const reason = data.code === 'SESSION_IDLE'
                            ? 'idle_timeout'
                            : 'session_expired';
                        clearAuth(reason);
                    }
                } catch {
                    // Network error — retry in 30s rather than logging out immediately
                    refreshTimerRef.current = setTimeout(
                        () => scheduleRefresh(jwtToken), 30_000
                    );
                }
            }, refreshIn);
        } catch {
            // Malformed JWT — clear immediately
            clearAuth('session_expired');
        }
    }, [clearAuth]);

    // ── Verify token on app load ───────────────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) { setLoading(false); return; }

        fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then(async r => {
                const data = await r.json();
                if (r.ok) {
                    setUser(data.user);
                    scheduleRefresh(token);
                } else {
                    const code = data.code;
                    if (code === 'TOKEN_EXPIRED') {
                        // JWT expired but session may still be valid — try refresh now
                        const sessionToken = localStorage.getItem(SESSION_KEY);
                        if (sessionToken) {
                            const rr = await fetch(`${API}/auth/refresh`, {
                                method:  'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body:    JSON.stringify({ session_token: sessionToken }),
                            });
                            const rd = await rr.json();
                            if (rr.ok) {
                                localStorage.setItem(TOKEN_KEY, rd.token);
                                // Re-fetch user with new token
                                const mr = await fetch(`${API}/auth/me`, {
                                    headers: { Authorization: `Bearer ${rd.token}` }
                                });
                                const md = await mr.json();
                                if (mr.ok) { setUser(md.user); scheduleRefresh(rd.token); }
                                else clearAuth('session_expired');
                            } else {
                                clearAuth(rd.code === 'SESSION_IDLE' ? 'idle_timeout' : 'session_expired');
                            }
                        } else {
                            clearAuth('session_expired');
                        }
                    } else {
                        clearAuth('session_expired');
                    }
                }
            })
            .catch(() => clearAuth(null))
            .finally(() => setLoading(false));

        return () => clearTimeout(refreshTimerRef.current);
    }, []);

    // ── Login ─────────────────────────────────────────────────────────
    const login = useCallback((userData, token, sessionToken) => {
        localStorage.setItem(TOKEN_KEY, token);
        if (sessionToken) localStorage.setItem(SESSION_KEY, sessionToken);
        setUser(userData);
        scheduleRefresh(token);
    }, [scheduleRefresh]);

    // ── Logout ────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                await fetch(`${API}/auth/logout`, {
                    method:  'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch { /* silently ignore network errors */ }
        }
        clearAuth(null);
    }, [clearAuth]);

    // ── Authenticated fetch — auto-refresh on TOKEN_EXPIRED ──────────
    const authFetch = useCallback(async (method, path, body, isForm = false) => {
        const doFetch = (tok) => {
            const headers = {
                ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
                ...(!isForm ? { 'Content-Type': 'application/json' } : {}),
            };
            return fetch(API + path, {
                method,
                headers,
                body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
            });
        };

        let res  = await doFetch(localStorage.getItem(TOKEN_KEY));
        let data = await res.json();

        // If JWT just expired mid-request, try a transparent refresh once
        if (!res.ok && res.status === 401 && data.code === 'TOKEN_EXPIRED') {
            const sessionToken = localStorage.getItem(SESSION_KEY);
            if (sessionToken) {
                const rr = await fetch(`${API}/auth/refresh`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ session_token: sessionToken }),
                });
                const rd = await rr.json();
                if (rr.ok) {
                    localStorage.setItem(TOKEN_KEY, rd.token);
                    scheduleRefresh(rd.token);
                    // Retry original request with new token
                    res  = await doFetch(rd.token);
                    data = await res.json();
                } else {
                    clearAuth(rd.code === 'SESSION_IDLE' ? 'idle_timeout' : 'session_expired');
                    throw new Error(rd.error || 'Session expired');
                }
            } else {
                clearAuth('session_expired');
                throw new Error('Session expired');
            }
        }

        if (!res.ok) {
            if (res.status === 401) clearAuth('session_expired');
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }, [clearAuth, scheduleRefresh]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, authFetch, isAdmin: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);