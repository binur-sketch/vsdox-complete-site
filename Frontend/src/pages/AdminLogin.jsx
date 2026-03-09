import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import API from '../config';

const AdminLogin = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw]     = useState(false);
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login }               = useAuth();
    const navigate                = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res  = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            login(data.user, data.token, data.session_token);
            navigate('/blog');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            {/* ── Full-viewport page ─────────────────────────────── */}
            <div style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
                overflow: 'hidden',
            }}>

                {/* Background photo layer */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=90&w=1800&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />

                {/* Dark gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'linear-gradient(135deg, rgba(8,14,30,0.88) 0%, rgba(15,35,70,0.82) 50%, rgba(8,14,30,0.92) 100%)',
                }} />

                {/* Subtle radial glow behind card */}
                <div style={{
                    position: 'absolute', zIndex: 2,
                    width: '600px', height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(29,99,237,0.18) 0%, transparent 70%)',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                }} />

                {/* Decorative corner orbs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', zIndex: 2, width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(29,99,237,0.10)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', zIndex: 2, width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(96,165,250,0.08)', pointerEvents: 'none' }} />

                {/* ── Floating card ───────────────────────────────── */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    width: '100%', maxWidth: '440px',
                    background: 'white',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '24px',
                    padding: 'clamp(28px, 6vw, 48px) clamp(24px, 6vw, 44px)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
                }}>

                    {/* Back to site link */}
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '12px', fontWeight: '600', color: 'rgba(37, 57, 146, 0.49)',
                        textDecoration: 'none', marginBottom: '28px',
                        transition: 'color 0.2s',
                        letterSpacing: '0.02em',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(48, 77, 240, 0.8)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(37, 57, 146, 0.49)'}>
                        ← Back to site
                    </Link>

                    {/* Logo + heading */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{
                            marginBottom: '20px',
                        }}>
                            <img src="/src/logo.png" alt="VsDox" style={{ height: '40px', width: 'auto', display: 'block' }} />
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: '800',
                            color: '#0f172a', marginBottom: '6px', lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                        }}>Welcome back</h1>
                        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '400' }}>
                            Sign in to your VSDox admin account
                        </p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div style={{
                            background: 'rgba(220,38,38,0.15)',
                            border: '1px solid rgba(220,38,38,0.4)',
                            color: '#fca5a5',
                            padding: '11px 14px', borderRadius: '10px',
                            fontSize: '13px', marginBottom: '20px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            animation: 'shake 0.35s ease',
                        }}>
                            <span style={{ fontSize: '15px' }}>⚠</span> {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Email */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '12px', fontWeight: '700',
                                color: '#64748b', marginBottom: '8px',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>Email</label>
                            <input
                                type="email"
                                placeholder="admin@vsdox.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '13px 16px',
                                    borderRadius: '10px', fontSize: '15px',
                                    background: '#f8fafc',
                                    border: '1.5px solid #e2e8f0',
                                    color: '#0f172a', outline: 'none',
                                    transition: 'border-color 0.2s, background 0.2s',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#ffffff'; }}
                                onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{
                                display: 'block', fontSize: '12px', fontWeight: '700',
                                color: '#64748b', marginBottom: '8px',
                                textTransform: 'uppercase', letterSpacing: '0.07em',
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '13px 48px 13px 16px',
                                        borderRadius: '10px', fontSize: '15px',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1.5px solid rgba(255,255,255,0.12)',
                                        color: 'white', outline: 'none',
                                        transition: 'border-color 0.2s, background 0.2s',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = '#ffffff'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                                />
                                {/* Show/hide toggle */}
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(0,0,0,0.3)', fontSize: '16px', padding: '2px',
                                        lineHeight: 1, transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,0,0,0.7)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.3)'}>
                                    {showPw ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '8px',
                                width: '100%', padding: '14px',
                                borderRadius: '10px', border: 'none',
                                background: loading
                                    ? 'rgba(29,99,237,0.5)'
                                    : 'linear-gradient(135deg, #1d63ed, #3b82f6)',
                                color: 'white', fontSize: '15px', fontWeight: '700',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: loading ? 'none' : '0 6px 20px rgba(29,99,237,0.4)',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(29,99,237,0.5)'; }}}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(29,99,237,0.4)'; }}>
                            {loading ? (
                                <>
                                    <span style={{
                                        width: '16px', height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        display: 'inline-block',
                                        animation: 'spin 0.7s linear infinite',
                                    }} />
                                    Signing in…
                                </>
                            ) : 'Sign In →'}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p style={{
                        marginTop: '24px', textAlign: 'center',
                        fontSize: '12px', color: '#94a3b8',
                        lineHeight: 1.5,
                    }}>
                        VSDox Admin · Authorised access only
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-6px); }
                    40%     { transform: translateX(6px); }
                    60%     { transform: translateX(-4px); }
                    80%     { transform: translateX(4px); }
                }
                input::placeholder { color: #94a3b8; }
                input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 100px #f8fafc inset !important;
                    -webkit-text-fill-color: #0f172a !important;
                }

                /* Mobile tweaks */
                @media (max-width: 480px) {
                    input { font-size: 16px !important; } /* prevent iOS zoom */
                }
            `}</style>
        </>
    );
};

export default AdminLogin;