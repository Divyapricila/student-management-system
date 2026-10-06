import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  User,
  Clock,
  Activity,
  Calendar
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await smartCampusService.getAuditLogs();
        setLogs(data || []);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => {
    const matchesAction = actionFilter === 'ALL' || l.action === actionFilter;
    const matchesSearch = !search ||
      l.details?.toLowerCase().includes(search.toLowerCase()) ||
      l.performedBy?.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType?.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'CREATE':
        return (
          <span style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            CREATE
          </span>
        );
      case 'UPDATE':
        return (
          <span style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            UPDATE
          </span>
        );
      case 'DELETE':
        return (
          <span style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            DELETE
          </span>
        );
      default:
        return (
          <span style={{
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#6366f1',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            {action}
          </span>
        );
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            System Audit Trail & Security Logs
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Immutable audit record of all administrative modifications, deletions, and operational events
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1.25rem 0 1.5rem',
        padding: '0.85rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search action logs, operators, entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} color="var(--text-muted)" style={{ marginRight: '4px' }} />
          {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map(act => (
            <button
              key={act}
              className={`pill-btn ${actionFilter === act ? 'active' : ''}`}
              onClick={() => setActionFilter(act)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving system audit logs...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Activity size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No audit logs recorded for filter</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Actor / Operator</th>
                  <th>IP Address</th>
                  <th>Audit Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {l.timestamp ? new Date(l.timestamp).toLocaleString() : 'Recent'}
                    </td>
                    <td>{getActionBadge(l.action)}</td>
                    <td>
                      <span style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {l.entityType} {l.entityId ? `#${l.entityId}` : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <User size={13} color="#6366f1" />
                        <span>{l.performedBy}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{l.ipAddress || '127.0.0.1'}</td>
                    <td style={{ maxWidth: '350px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{l.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
