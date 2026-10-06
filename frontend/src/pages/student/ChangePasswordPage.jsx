import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import studentPortalService from '../../services/studentPortalService';

export default function ChangePasswordPage({ onShowToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please provide your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await studentPortalService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      setSuccess('Password changed successfully.');
      onShowToast('Password changed successfully.', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password. Verify your current password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">Change Password</h2>
          <p className="portal-page-subtitle">
            Update your account password to ensure ongoing portal security
          </p>
        </div>
      </div>

      <div className="dashboard-card" style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} style={{ color: 'var(--primary)' }} />
            <span>Update Credentials</span>
          </div>
        </div>

        {success && (
          <div className="alert-box success" style={{ marginBottom: '1.25rem' }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="alert-box danger" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="current-password">
              Current Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your existing password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-password">
              New Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? 'Hide password' : 'Show password'}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="confirm-new-password"
                type={showConfirm ? 'text' : 'password'}
                className="form-control"
                placeholder="Re-enter new password to confirm"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={submitting}
            >
              {submitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
