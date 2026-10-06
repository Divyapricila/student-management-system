import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import academicAdminService from '../../services/academicAdminService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminCalendarPage({ onShowToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('CLASS');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('5');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await academicAdminService.getCalendarEvents();
      setEvents(data || []);
    } catch (err) {
      onShowToast('Error loading calendar events: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) {
      onShowToast('Please provide event title and date.', 'error');
      return;
    }

    setSaving(true);
    try {
      await academicAdminService.createCalendarEvent({
        title: title.trim(),
        eventType,
        eventDate,
        department,
        semester: semester ? Number(semester) : null,
        description: description.trim(),
      });
      onShowToast('Academic calendar event created successfully!', 'success');
      setTitle('');
      setDescription('');
      fetchEvents();
    } catch (err) {
      onShowToast(err.message || 'Failed to create event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id, evTitle) => {
    if (!window.confirm(`Are you sure you want to remove event "${evTitle}"?`)) return;

    try {
      await academicAdminService.deleteCalendarEvent(id);
      onShowToast('Event removed successfully.', 'success');
      fetchEvents();
    } catch (err) {
      onShowToast(err.message || 'Failed to delete event.', 'error');
    }
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'INTERNAL_EXAM':
      case 'MID_EXAM':
        return 'badge-warning';
      case 'EXAM':
        return 'badge-danger';
      case 'HOLIDAY':
        return 'badge-success';
      case 'PROJECT_REVIEW':
        return 'badge-indigo';
      case 'ASSIGNMENT':
        return 'badge-purple';
      case 'CLASS':
      default:
        return 'badge-blue';
    }
  };

  return (
    <div className="admin-calendar-page">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">Manage Semester Calendar</h2>
          <p className="portal-page-subtitle">
            Schedule academic events, class notifications, examinations, and official holidays
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Add Event Form */}
        <div className="dashboard-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} style={{ color: 'var(--primary)' }} />
              <span>Create New Calendar Event</span>
            </div>
          </div>

          <form onSubmit={handleAddEvent}>
            <div className="form-group">
              <label className="form-label" htmlFor="ev-title">
                Event Title
              </label>
              <input
                id="ev-title"
                type="text"
                className="form-control"
                placeholder="e.g. Mid Examination Units 1-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ev-type">
                  Event Category
                </label>
                <select
                  id="ev-type"
                  className="form-control"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="CLASS">Class Session</option>
                  <option value="INTERNAL_EXAM">Internal Exam</option>
                  <option value="EXAM">University Exam</option>
                  <option value="PROJECT_REVIEW">Project Review</option>
                  <option value="ASSIGNMENT">Assignment Due</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="EVENT">Campus Event</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ev-date">
                  Event Date
                </label>
                <input
                  id="ev-date"
                  type="date"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ev-dept">
                  Department
                </label>
                <select
                  id="ev-dept"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="ALL">All Departments</option>
                  <option value="ECE">ECE</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ev-sem">
                  Semester
                </label>
                <select
                  id="ev-sem"
                  className="form-control"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ev-desc">
                Description / Instructions
              </label>
              <textarea
                id="ev-desc"
                className="form-control"
                rows={3}
                placeholder="Details regarding syllabus, timings, venue, or submissions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={saving}
            >
              {saving ? <span>Adding Event...</span> : <span>Publish Event to Student Portal</span>}
            </button>
          </form>
        </div>

        {/* Existing Events List */}
        <div className="dashboard-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarDays size={18} style={{ color: '#8b5cf6' }} />
              <span>Existing Academic Events ({events.length})</span>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading events..." />
          ) : events.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No events registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
              {events.map((ev) => (
                <div key={ev.id} className="campus-event-card" style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>{ev.title}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span className={`badge ${getEventBadge(ev.eventType)}`} style={{ fontSize: '0.7rem' }}>
                          {ev.eventType}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                          {ev.department || 'ALL'} • Sem {ev.semester || 'All'}
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      title="Delete event"
                      style={{ padding: '4px', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    📅 {ev.eventDate} {ev.description ? `• ${ev.description}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
