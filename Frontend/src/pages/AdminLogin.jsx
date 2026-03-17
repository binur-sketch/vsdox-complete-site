import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { DEFAULTS } from '../config/appConstants';
import { apiFetch } from '../services/apiClient';
import logo from '../logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirm, setForgotConfirm] = useState('');
  const [forgotInfo, setForgotInfo] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('POST', API_ENDPOINTS.auth.login, { email, password });
      login(data.user, data.token, data.session_token);
      navigate('/blog');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetToken = async () => {
    const trimmedEmail = forgotEmail.trim();
    if (!trimmedEmail) {
      setForgotInfo('Please provide the email associated with your account.');
      return;
    }
    setForgotLoading(true);
    setForgotInfo('');

    try {
      const payload = await apiFetch('POST', API_ENDPOINTS.auth.forgotPassword, { email: trimmedEmail });
      const expires = payload?.expires_at;
      setResetToken('');
      if (expires) {
        setForgotInfo(`Token expires ${new Date(expires).toLocaleString()}`);
      } else {
        setForgotInfo('If the email exists, you will receive password reset instructions shortly.');
      }
    } catch (err) {
      setForgotInfo(err.message || 'Failed to request reset token');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken.trim()) {
      setForgotInfo('Enter the reset token you received.');
      return;
    }
    if (!forgotPassword || !forgotConfirm) {
      setForgotInfo('Provide and confirm the new password.');
      return;
    }
    if (forgotPassword !== forgotConfirm) {
      setForgotInfo('New passwords do not match.');
      return;
    }
    if (forgotPassword.length < 8) {
      setForgotInfo('Password must be at least 8 characters long.');
      return;
    }

    setResetLoading(true);
    setForgotInfo('');

    try {
      await apiFetch('POST', API_ENDPOINTS.auth.resetPassword, {
        token: resetToken.trim(),
        password: forgotPassword,
      });
      setForgotInfo('Password reset successfully. You can now sign in.');
      setMode('login');
      setForgotPassword('');
      setForgotConfirm('');
      setResetToken('');
      setForgotEmail('');
      setError('');
    } catch (err) {
      setForgotInfo(err.message || 'Failed to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div
        className="admin-login-bg"
        style={{
          backgroundImage: `url('${DEFAULTS.adminLoginBackground}')`,
        }}
      />
      <div className="admin-login-overlay" />
      <div className="admin-login-glow" />
      <div className="admin-login-orb admin-login-orb-top" />
      <div className="admin-login-orb admin-login-orb-bottom" />

      <div className="admin-login-card">
        <Link to="/" className="admin-login-back-link">
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to site
        </Link>

        {mode === 'login' && (
          <div className="admin-login-header">
            <img src={logo} alt="VSDOX – Admin Portal | Enterprise Content Management" className="admin-login-logo" />
            <h1>Admin Portal Login</h1>
            <p>Secure access to your VSDOX administration services</p>
          </div>
        )}

        {mode === 'login' ? (
          <>
            {error && (
              <div className="admin-login-error">
                <span>!</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="admin@vsdox.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <div className="admin-login-password-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPw((prev) => !prev)} className="admin-login-password-toggle">
                    <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="admin-login-submit">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="admin-login-helper">
              <button
                type="button"
                className="admin-login-link"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setForgotInfo('');
                }}
              >
                Forgot password?
              </button>
            </p>
          </>
        ) : (
          <div className="admin-login-forgot">
            <p className="admin-login-forgot-title">Reset your password</p>
            <p className="admin-login-forgot-text">
              Enter the admin email to receive a temporary reset token, then update your password below.
            </p>
            {forgotInfo && <div className="admin-login-info">{forgotInfo}</div>}

            <div className="admin-login-forgot-grid">
              <div>
                <label>Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@vsdox.com"
                autoComplete="off"
              />
              </div>
              <div>
                <label>Reset token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Copy the token from email"
                autoComplete="off"
              />
              </div>
            </div>

            <div className="admin-login-forgot-row">
              <button
                type="button"
                className="admin-login-submit admin-login-submit-ghost"
                onClick={handleSendResetToken}
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Requesting token...' : 'Send reset token'}
              </button>
            </div>

            <div className="admin-login-forgot-grid">
              <div>
                <label>New password</label>
                <input
                  type="password"
                  value={forgotPassword}
                  onChange={(e) => setForgotPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="off"
                />
              </div>
              <div>
                <label>Confirm password</label>
                <input
                  type="password"
                  value={forgotConfirm}
                  onChange={(e) => setForgotConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="admin-login-forgot-row">
              <button
                type="button"
                className="admin-login-submit"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? 'Resetting...' : 'Reset password'}
              </button>
            </div>

            <p className="admin-login-helper">
              <button
                type="button"
                className="admin-login-link"
                onClick={() => {
                  setMode('login');
                  setForgotInfo('');
                }}
              >
                Back to sign in
              </button>
            </p>
          </div>
        )}

        <p className="admin-login-footer">VSDox Admin | Authorised access only</p>
      </div>
    </div>
  );
};

export default AdminLogin;
