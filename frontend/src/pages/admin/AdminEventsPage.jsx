import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Search,
  Calendar,
  Users,
  MapPin,
  X
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '09:00 AM - 05:00 PM',
    venue: 'Auditorium Hall',
    organizer: 'Faculty Coordinator',
    maxParticipants: 100,
    category: 'TECHNICAL'
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminEvents();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createEvent(form);
      setEvents(prev => [...prev, created]);
      addToast(`Event "${form.title}" created!`, 'success');
      setShowAddModal(false);
      setForm({
        title: '',
        description: '',
        eventDate: '',
        eventTime: '09:00 AM - 05:00 PM',
        venue: 'Auditorium Hall',
        organizer: 'Faculty Coordinator',
        maxParticipants: 100,
        category: 'TECHNICAL'
      });
    } catch (err) {
      console.error('Create event error', err);
      addToast('Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel event "${title}"?`)) return;
    try {
      await smartCampusService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      addToast('Event cancelled.', 'info');
    } catch (err) {
      addToast('Failed to delete event', 'error');
    }
  };

  const filtered = events.filter(e =>
    !search ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Campus Event Administration
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Coordinate technical symposiums, hackathons, guest lectures, and cultural galas
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Create Event</span>
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '1.25rem 0',
        padding: '0.75rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        maxWidth: '380px'
      }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search by title, venue, organizer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Sparkles size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No events scheduled</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Organizer</th>
                  <th>Capacity</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</span>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {ev.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ev.eventDate}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ev.eventTime}</div>
                    </td>
                    <td>{ev.venue}</td>
                    <td>{ev.organizer}</td>
                    <td>{ev.registeredCount || 0} / {ev.maxParticipants || '∞'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(ev.id, ev.title)}
                        title="Cancel event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Create Campus Event
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Campus Hackathon 2026"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="CULTURAL">CULTURAL</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="SPORTS">SPORTS</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Max Seats / RSVP Limit
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={form.maxParticipants}
                    onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Time
                  </label>
                  <input
                    type="text"
                    value={form.eventTime}
                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Venue
                  </label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Organizer / Society
                  </label>
                  <input
                    type="text"
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline topics, eligibility, prizes, or guest speaker profiles..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
