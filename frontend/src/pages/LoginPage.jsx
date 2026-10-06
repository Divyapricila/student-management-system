import React, { useState } from 'react';
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import authService from '../services/authService';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authData = await authService.login(username.trim(), password);
      onLoginSuccess(authData);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap size={32} />
          </div>
          <h1 className="login-title">EduManage Portal</h1>
          <p className="login-subtitle">Student Management & Academic Information System</p>
        </div>

        {/* Welcome Notice */}
        <div className="login-welcome-banner">
          <span>👋 Welcome back! Sign in to access your portal.</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username / Student ID
            </label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="e.g. admin or student001 / STU001"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border"></span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials for Viva / Demo */}
        <div className="demo-credentials-box">
          <p className="demo-title">Quick Demo Login Shortcuts</p>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="demo-btn admin"
              onClick={() => handleQuickFill('admin', 'Admin@123')}
              title="Click to fill Admin credentials"
            >
              <ShieldCheck size={14} />
              <span>Admin (admin)</span>
            </button>
            <button
              type="button"
              className="demo-btn student"
              onClick={() => handleQuickFill('student001', 'Student@123')}
              title="Click to fill Rahul (STU001) credentials"
            >
              <UserCheck size={14} />
              <span>STU001 (Rahul - ECE)</span>
            </button>
            <button
              type="button"
              className="demo-btn student"
              onClick={() => handleQuickFill('student002', 'Student@123')}
              title="Click to fill Priya (STU002) credentials"
            >
              <UserCheck size={14} />
              <span>STU002 (Priya - CSE)</span>
            </button>
            <button
              type="button"
              className="demo-btn student"
              onClick={() => handleQuickFill('student003', 'Student@123')}
              title="Click to fill Arjun (STU003) credentials"
            >
              <UserCheck size={14} />
              <span>STU003 (Arjun - EEE)</span>
            </button>
          </div>
          <p className="demo-hint">
            Demo password for all 15 students is <strong>Student@123</strong>. Admin is <strong>Admin@123</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
