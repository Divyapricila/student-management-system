import React, { useState, useEffect } from 'react';
import {
  Users2,
  CheckCircle2,
  Search,
  Filter,
  UserCheck,
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function StudentClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const { addToast } = useToast();

  const categories = ['ALL', 'TECHNICAL', 'CULTURAL', 'SOCIAL', 'ENTREPRENEURSHIP', 'SPORTS'];

  const loadClubs = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getClubs();
      setClubs(data || []);
    } catch (err) {
      console.error('Failed to load clubs', err);
      addToast('Could not load student clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleJoin = async (id, name) => {
    try {
      setActionLoading(id);
      await smartCampusService.joinClub(id);
      setClubs(prev =>
        prev.map(c => c.id === id ? { ...c, isMember: true, memberCount: (c.memberCount || 0) + 1 } : c)
      );
      addToast(`You have joined "${name}"!`, 'success');
    } catch (err) {
      console.error('Join failed', err);
      addToast('Failed to join club', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (id, name) => {
    try {
      setActionLoading(id);
      await smartCampusService.leaveClub(id);
      setClubs(prev =>
        prev.map(c => c.id === id ? { ...c, isMember: false, memberCount: Math.max(0, (c.memberCount || 1) - 1) } : c)
      );
      addToast(`You left "${name}".`, 'info');
    } catch (err) {
      console.error('Leave failed', err);
      addToast('Failed to leave club', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = clubs.filter(c => {
    const matchesCat = category === 'ALL' || c.category === category;
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.facultyAdvisor && c.facultyAdvisor.toLowerCase().includes(search.toLowerCase())) ||
      (c.studentLead && c.studentLead.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="analytics-container fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Student Clubs & Societies
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Join collegiate organizations, build leadership experience, and collaborate with peers
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
            placeholder="Search clubs, mentors, leads..."
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
          {[1, 2, 3].map(k => (
            <div key={k} className="analytics-card" style={{ height: '220px', opacity: 0.6 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Users2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No clubs found</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            No collegiate groups found matching your search.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(club => (
            <div
              key={club.id}
              className="analytics-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderTop: club.isMember ? '4px solid #10b981' : '4px solid #6366f1'
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
                    {club.category}
                  </span>

                  {club.isMember && (
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
                      <CheckCircle2 size={12} /> Member
                    </span>
                  )}
                </div>

                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {club.name}
                </h3>

                <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {club.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {club.facultyAdvisor && (
                    <div>
                      <strong>Mentor:</strong> {club.facultyAdvisor}
                    </div>
                  )}
                  {club.studentLead && (
                    <div>
                      <strong>Student Lead:</strong> {club.studentLead}
                    </div>
                  )}
                  <div>
                    <strong>Total Members:</strong> {club.memberCount || 0} students
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                {club.isMember ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.25)', fontSize: '0.78rem' }}
                    disabled={actionLoading === club.id}
                    onClick={() => handleLeave(club.id, club.name)}
                  >
                    {actionLoading === club.id ? 'Leaving...' : 'Leave Club'}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                    disabled={actionLoading === club.id}
                    onClick={() => handleJoin(club.id, club.name)}
                  >
                    {actionLoading === club.id ? 'Joining...' : 'Join Society'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
