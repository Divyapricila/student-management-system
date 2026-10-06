import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Pin,
  Calendar,
  User,
  Search,
  Filter,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'PLACEMENT', 'FEE', 'GENERAL'];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await smartCampusService.getAnnouncements();
        setAnnouncements(data || []);
      } catch (err) {
        console.error('Failed to load announcements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filtered = announcements.filter(item => {
    const matchesCategory = category === 'ALL' || item.category === category;
    const matchesSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      (item.targetDepartment && item.targetDepartment.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <AlertTriangle size={12} /> URGENT
          </span>
        );
      case 'IMPORTANT':
        return (
          <span style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Info size={12} /> IMPORTANT
          </span>
        );
      default:
        return (
          <span style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 600
          }}>
            NORMAL
          </span>
        );
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Notice Board & Official Announcements
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Campus circulars, exam notifications, placement updates, and academic directives
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
            placeholder="Search circulars, department keywords..."
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map(k => (
            <div key={k} className="analytics-card" style={{ height: '110px', opacity: 0.6 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Megaphone size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No announcements found</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            There are no campus notices matching the selected filter criteria.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(item => (
            <div
              key={item.id}
              className="analytics-card"
              style={{
                position: 'relative',
                borderLeft: item.isPinned ? '4px solid #6366f1' : item.priority === 'URGENT' ? '4px solid #ef4444' : '1px solid var(--border-color)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {item.isPinned && (
                    <span style={{
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Pin size={12} /> PINNED
                    </span>
                  )}
                  {getPriorityBadge(item.priority)}
                  <span style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600
                  }}>
                    {item.category}
                  </span>
                  {item.targetDepartment && (
                    <span style={{
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem'
                    }}>
                      Dept: {item.targetDepartment}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {item.publishDate}
                  </span>
                  {item.author && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} /> {item.author}
                    </span>
                  )}
                </div>
              </div>

              <h3 style={{
                margin: '0.75rem 0 0.5rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}>
                {item.title}
              </h3>

              <div style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {item.content}
              </div>

              {item.attachmentUrl && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                  <a
                    href={item.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> View Circular Attachment
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
