import React from 'react';
import { X, Calendar, MapPin, Tag } from 'lucide-react';

export default function CampusEventsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const events = [
    {
      id: 1,
      title: "TechNova 2026 - Annual National Symposium",
      date: "Nov 05, 2026",
      time: "09:30 AM - 04:30 PM",
      venue: "Auditorium & Innovation Hub",
      category: "Technical Fest",
      desc: "Inter-collegiate paper presentations, robotics challenge, coding hackathon, and cash prizes."
    },
    {
      id: 2,
      title: "Embedded Systems & IoT Hands-on Workshop",
      date: "Oct 24, 2026",
      time: "10:00 AM - 01:00 PM",
      venue: "VLSI & Embedded Lab (Block B)",
      category: "Workshop",
      desc: "Comprehensive practical session on ARM Cortex controllers and MQTT cloud sensors."
    },
    {
      id: 3,
      title: "Campus Placement Prep & Mock Interviews",
      date: "Oct 18, 2026",
      time: "02:00 PM - 05:00 PM",
      venue: "Placement Cell Seminar Hall",
      category: "Career & Training",
      desc: "Aptitude training, resume review by alumni, and technical mock interviews."
    },
    {
      id: 4,
      title: "Inter-Department Cricket & Football Tournament",
      date: "Nov 12, 2026",
      time: "08:00 AM - 05:00 PM",
      venue: "University Sports Arena",
      category: "Sports",
      desc: "Annual championship trophy matches between ECE, CSE, IT, EEE, MECH, and CIVIL."
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon purple" style={{ width: '36px', height: '36px' }}>
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="modal-title">Upcoming Campus Events</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Official campus academic & co-curricular schedule
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {events.map((ev) => (
              <div key={ev.id} className="campus-event-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {ev.title}
                  </h4>
                  <span className="badge badge-purple" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                    <Tag size={12} style={{ marginRight: '4px' }} />
                    {ev.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {ev.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} style={{ color: 'var(--primary)' }} />
                    {ev.date} • {ev.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: '#ef4444' }} />
                    {ev.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
