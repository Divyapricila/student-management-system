import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  Search,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function StudentEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const { addToast } = useToast();

  const categories = ['ALL', 'TECHNICAL', 'CULTURAL', 'HACKATHON', 'WORKSHOP', 'SPORTS'];

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load events', err);
      addToast('Could not load campus events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRegister = async (id, title) => {
    try {
      setActionLoading(id);
      await smartCampusService.registerEvent(id);
      setEvents(prev =>
        prev.map(ev => ev.id === id ? { ...ev, isRegistered: true, registeredCount: (ev.registeredCount || 0) + 1 } : ev)
      );
      addToast(`Successfully registered for "${title}"!`, 'success');
    } catch (err) {
      console.error('Registration failed', err);
      addToast('Registration failed or capacity reached', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelRegistration = async (id, title) => {
    try {
      setActionLoading(id);
      await smartCampusService.cancelEvent(id);
      setEvents(prev =>
        prev.map(ev => ev.id === id ? { ...ev, isRegistered: false, registeredCount: Math.max(0, (ev.registeredCount || 1) - 1) } : ev)
      );
      addToast(`Registration for "${title}" cancelled.`, 'info');
    } catch (err) {
      console.error('Cancel failed', err);
      addToast('Failed to cancel registration', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = events.filter(ev => {
    const matchesCat = category === 'ALL' || ev.category === category;
    const matchesSearch = !search ||
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      (ev.venue && ev.venue.toLowerCase().includes(search.toLowerCase())) ||
      (ev.organizer && ev.organizer.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="analytics-container fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Campus Life & Events
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Discover college hackathons, technical symposiums, workshops, and student festivals
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
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
            placeholder="Search events, venues, organizers..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={15} color="var(--text-muted)" style={{ marginRight: '4px' }} />
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map(k => (
            <div key={k} className="analytics-card" style={{ height: '220px', opacity: 0.6 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Sparkles size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No events found</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Try choosing another category or clearing your search term.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(ev => {
            const isFull = ev.maxParticipants && (ev.registeredCount >= ev.maxParticipants);
            return (
              <div
                key={ev.id}
                className="analytics-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderTop: ev.isRegistered ? '4px solid #10b981' : '4px solid #6366f1'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <span style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {ev.category}
                    </span>

                    {ev.isRegistered ? (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        <CheckCircle2 size={12} /> Registered
                      </span>
                    ) : isFull ? (
                      <span style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        House Full
                      </span>
                    ) : null}
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ev.title}
                  </h3>

                  <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {ev.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#6366f1" />
                      <span>{ev.eventDate} • {ev.eventTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#6366f1" />
                      <span>{ev.venue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} color="#6366f1" />
                      <span>{ev.registeredCount || 0} / {ev.maxParticipants || 'Unlimited'} seats filled</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    By: {ev.organizer}
                  </span>

                  {ev.isRegistered ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.25)', fontSize: '0.78rem' }}
                      disabled={actionLoading === ev.id}
                      onClick={() => handleCancelRegistration(ev.id, ev.title)}
                    >
                      {actionLoading === ev.id ? 'Cancelling...' : 'Cancel RSVP'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                      disabled={isFull || actionLoading === ev.id}
                      onClick={() => handleRegister(ev.id, ev.title)}
                    >
                      {actionLoading === ev.id ? 'Registering...' : 'Register RSVP'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
