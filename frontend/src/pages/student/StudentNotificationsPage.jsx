import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  Calendar,
  AlertCircle,
  FileCheck2,
  DollarSign,
  Sparkles,
  Info
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function StudentNotificationsPage({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const { addToast } = useToast();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
      addToast('Could not load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await smartCampusService.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      addToast('Notification marked as read', 'success');
    } catch (err) {
      addToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await smartCampusService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      addToast('All notifications marked as read', 'success');
    } catch (err) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  const filteredList = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ATTENDANCE':
        return <AlertCircle size={18} className="text-amber-500" />;
      case 'EXAM':
        return <Calendar size={18} className="text-blue-500" />;
      case 'ASSIGNMENT':
        return <FileCheck2 size={18} className="text-indigo-500" />;
      case 'FEE':
        return <DollarSign size={18} className="text-emerald-500" />;
      case 'EVENT':
        return <Sparkles size={18} className="text-purple-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  const formatTimestamp = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return iso;
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Notification Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Real-time updates regarding exams, classes, payments, and campus life
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="status-pills" style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className={`pill-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`pill-btn ${filter === 'UNREAD' ? 'active' : ''}`}
              onClick={() => setFilter('UNREAD')}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleMarkAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CheckCheck size={16} />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem' }}>
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="analytics-card" style={{ padding: '1.25rem', height: '70px', opacity: 0.6 }} />
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="empty-state-card" style={{ marginTop: '2rem', textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Bell size={28} />
          </div>
          <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>No notifications to display</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {filter === 'UNREAD' ? 'You have caught up with all your unread alerts!' : 'You have no system notifications at this time.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`notification-item-card ${!item.isRead ? 'unread' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '12px',
                background: item.isRead ? 'var(--bg-card)' : 'var(--bg-highlight, rgba(99, 102, 241, 0.05))',
                border: item.isRead ? '1px solid var(--border-color)' : '1px solid rgba(99, 102, 241, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ marginTop: '0.2rem' }}>
                {getTypeIcon(item.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#6366f1',
                        color: '#fff',
                        padding: '1px 7px',
                        borderRadius: '999px',
                        textTransform: 'uppercase'
                      }}>
                        New
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>

                <p style={{ margin: '0.35rem 0 0.5rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {item.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {item.actionUrl && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        if (onNavigate) {
                          const tab = item.actionUrl.replace('/student/', '');
                          onNavigate(tab);
                        }
                      }}
                    >
                      View Details →
                    </button>
                  )}

                  {!item.isRead && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      <Check size={14} style={{ marginRight: '3px' }} /> Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
