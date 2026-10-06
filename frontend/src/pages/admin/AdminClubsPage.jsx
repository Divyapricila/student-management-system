import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  Trash2,
  Search,
  UserCheck,
  X
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'TECHNICAL',
    facultyAdvisor: '',
    studentLead: '',
    memberCount: 0
  });

  const loadClubs = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminClubs();
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createClub(form);
      setClubs(prev => [...prev, created]);
      addToast(`Club "${form.name}" registered!`, 'success');
      setShowAddModal(false);
      setForm({
        name: '',
        description: '',
        category: 'TECHNICAL',
        facultyAdvisor: '',
        studentLead: '',
        memberCount: 0
      });
    } catch (err) {
      console.error('Create club error', err);
      addToast('Failed to register club', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Disband and delete club "${name}"?`)) return;
    try {
      await smartCampusService.deleteClub(id);
      setClubs(prev => prev.filter(c => c.id !== id));
      addToast('Club removed.', 'info');
    } catch (err) {
      addToast('Failed to delete club', 'error');
    }
  };

  const filtered = clubs.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Student Clubs & Societies Administration
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Charter new collegiate societies, assign faculty advisors, and monitor memberships
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Charter New Club</span>
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
          placeholder="Search clubs, categories, advisors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading student clubs...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Users2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No student clubs found</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Club Name</th>
                  <th>Category</th>
                  <th>Faculty Advisor</th>
                  <th>Student Lead</th>
                  <th>Members</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.description}
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
                        {c.category}
                      </span>
                    </td>
                    <td>{c.facultyAdvisor || 'Unassigned'}</td>
                    <td>{c.studentLead || 'TBD'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#6366f1' }}>{c.memberCount || 0}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete club"
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

      {/* Add Club Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Charter Student Organization
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Club / Society Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEEE Robotics & Automation Society"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    <option value="CULTURAL">CULTURAL</option>
                    <option value="ENTREPRENEURSHIP">ENTREPRENEURSHIP</option>
                    <option value="SOCIAL">SOCIAL</option>
                    <option value="SPORTS">SPORTS</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Initial Members
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.memberCount}
                    onChange={(e) => setForm({ ...form, memberCount: Number(e.target.value) })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Faculty Mentor
                  </label>
                  <input
                    type="text"
                    placeholder="Prof. Ramesh Gupta"
                    value={form.facultyAdvisor}
                    onChange={(e) => setForm({ ...form, facultyAdvisor: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Student Lead / President
                  </label>
                  <input
                    type="text"
                    placeholder="Rahul Sharma"
                    value={form.studentLead}
                    onChange={(e) => setForm({ ...form, studentLead: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Mission & Objectives
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the club mission, activities, meeting days, and eligibility..."
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
                  {submitting ? 'Registering...' : 'Charter Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
