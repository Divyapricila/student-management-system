import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const { addToast } = useToast();

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getSettings();
      setSettings(data || []);
    } catch (err) {
      console.error('Failed to load settings', err);
      addToast('Could not load campus settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleValueChange = (key, val) => {
    setSettings(prev =>
      prev.map(s => s.settingKey === key ? { ...s, settingValue: val } : s)
    );
  };

  const handleSave = async (setting) => {
    try {
      setSavingKey(setting.settingKey);
      await smartCampusService.updateSetting(setting);
      addToast(`Updated parameter "${setting.settingKey}"!`, 'success');
    } catch (err) {
      console.error('Update setting error', err);
      addToast('Failed to save setting', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Smart Campus Configuration & Policy Rules
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Dynamically adjust institutional thresholds, attendance rules, passing standards, and calendar terms
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={loadSettings}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <RefreshCw size={15} />
          <span>Reload Parameters</span>
        </button>
      </div>

      <div className="analytics-card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading parameters...</div>
        ) : settings.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Settings size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No configurable parameters found</h4>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {settings.map((s) => (
              <div
                key={s.settingKey}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.15rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Sliders size={16} color="#6366f1" />
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                      {s.settingKey}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {s.description || 'Configures campus automated rule evaluation.'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={s.settingValue || ''}
                    onChange={(e) => handleValueChange(s.settingKey, e.target.value)}
                    className="form-control"
                    style={{
                      width: '200px',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={savingKey === s.settingKey}
                    onClick={() => handleSave(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem' }}
                  >
                    <Save size={15} />
                    <span>{savingKey === s.settingKey ? 'Saving...' : 'Apply'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        borderRadius: '10px',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <ShieldCheck size={20} color="#6366f1" />
        <div>
          <strong>Real-Time Policy Evaluation:</strong> Modifying parameters like <code>MIN_ATTENDANCE_PERCENTAGE</code> immediately affects at-risk evaluations and student attendance recovery formulas throughout the platform.
        </div>
      </div>
    </div>
  );
}
