import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import studentPortalService from '../../services/studentPortalService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentCalendarPage({ initialSemester = 5, onShowToast }) {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to October 2026 as per project context
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // 0-indexed: 9 = October
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const data = await studentPortalService.getMyCalendar(selectedSemester);
        if (isMounted) {
          setEvents(data || []);
          if (data && data.length > 0) {
            setSelectedEvent(data[0]);
          }
        }
      } catch (err) {
        if (isMounted) onShowToast(err.message || 'Error loading calendar', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCalendar();
    return () => { isMounted = false; };
  }, [selectedSemester]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = Jan, 9 = Oct

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    // Return to default semester focus: October 2026
    setCurrentDate(new Date(2026, 9, 1));
  };

  // Helper for event type colors
  const getEventBadgeClass = (type) => {
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

  // Build calendar matrix
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayNumber: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateString: `${year}-${formattedMonth}-${formattedDay}`,
    });
  }

  // Next month leading days
  const remainingSlots = 42 - calendarDays.length;
  for (let d = 1; d <= remainingSlots; d++) {
    const formattedNextMonth = String(month + 2).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: false,
      dateString: `${year}-${formattedNextMonth}-${formattedDay}`,
    });
  }

  // Map events to date strings
  const eventsByDate = {};
  events.forEach((ev) => {
    if (!eventsByDate[ev.eventDate]) {
      eventsByDate[ev.eventDate] = [];
    }
    eventsByDate[ev.eventDate].push(ev);
  });

  return (
    <div className="calendar-page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="portal-page-title">Semester Calendar</h2>
          <p className="portal-page-subtitle">
            Curriculum schedule, internal tests, exams, holidays, reviews, and project submissions
          </p>
        </div>

        <div className="semester-selector-box">
          <label htmlFor="cal-semester-select" className="selector-label">
            Select Semester
          </label>
          <select
            id="cal-semester-select"
            className="form-control semester-dropdown"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem} {sem === 5 ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message={`Loading academic calendar for Semester ${selectedSemester}...`} />
      ) : (
        <div className="calendar-layout-grid">
          {/* Main Monthly Calendar Card */}
          <div className="calendar-card">
            {/* Calendar Controls Bar */}
            <div className="calendar-controls-bar">
              <div className="month-heading">
                <CalendarIcon size={20} style={{ color: 'var(--primary)' }} />
                <span>
                  {monthNames[month]} {year}
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.74rem', marginLeft: '0.5rem' }}>
                  Semester {selectedSemester}
                </span>
              </div>

              <div className="calendar-nav-buttons">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleToday}
                >
                  Today
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="calendar-week-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw, idx) => (
                <div key={dw} className={`week-day-title ${idx === 0 ? 'weekend' : ''}`}>
                  {dw}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="calendar-grid">
              {calendarDays.map((cell, idx) => {
                const dayEvents = eventsByDate[cell.dateString] || [];
                const isToday = cell.dateString === '2026-10-06';

                return (
                  <div
                    key={idx}
                    className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                  >
                    <div className="cell-day-number">
                      <span>{cell.dayNumber}</span>
                      {isToday && <span className="today-badge">TODAY</span>}
                    </div>

                    <div className="cell-events-list">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`calendar-event-tag ${getEventBadgeClass(ev.eventType)}`}
                          onClick={() => setSelectedEvent(ev)}
                          title={`${ev.title} (${ev.eventType})`}
                        >
                          <span className="event-tag-title">{ev.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar: Event Details & Upcoming Feed */}
          <div className="calendar-sidebar-panel">
            {/* Selected Event Details Card */}
            {selectedEvent ? (
              <div className="dashboard-card" style={{ marginBottom: '1.25rem' }}>
                <div className="card-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.96rem' }}>Event Details</span>
                  </div>
                  <span className={`badge ${getEventBadgeClass(selectedEvent.eventType)}`}>
                    {selectedEvent.eventType.replace('_', ' ')}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  {selectedEvent.title}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarDays size={14} style={{ color: 'var(--primary)' }} />
                    <span>Date: {selectedEvent.eventDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} style={{ color: '#8b5cf6' }} />
                    <span>Target: {selectedEvent.department || 'ALL'} Department</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {selectedEvent.description || 'No additional notes provided for this academic event.'}
                </p>
              </div>
            ) : null}

            {/* Upcoming Academic Schedule Feed */}
            <div className="dashboard-card">
              <div className="card-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} style={{ color: '#d97706' }} />
                  <span style={{ fontSize: '0.96rem' }}>All Semester Events</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {events.length} Events
                </span>
              </div>

              <div className="upcoming-events-list">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`upcoming-event-item ${selectedEvent?.id === ev.id ? 'active' : ''}`}
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="upcoming-date-col">
                      <span className="ev-month">
                        {new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="ev-day">
                        {ev.eventDate.split('-')[2]}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ev-title">{ev.title}</div>
                      <div className="ev-type-badge">
                        <span className={`badge ${getEventBadgeClass(ev.eventType)}`} style={{ fontSize: '0.7rem' }}>
                          {ev.eventType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
