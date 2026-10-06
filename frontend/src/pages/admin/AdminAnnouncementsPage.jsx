import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Search,
  Pin,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    priority: 'NORMAL',
    targetDepartment: '',
    isPinned: false,
    attachmentUrl: ''
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to load announcements', err);
      addToast('Could not load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createAnnouncement(form);
      setAnnouncements(prev => [created, ...prev]);
      addToast(`Notice "${form.title}" published!`, 'success');
      setShowAddModal(false);
      setForm({
        title: '',
        content: '',
        category: 'GENERAL',
        priority: 'NORMAL',
        targetDepartment: '',
        isPinned: false,
        attachmentUrl: ''
      });
    } catch (err) {
      console.error('Create announcement error', err);
      addToast('Failed to publish circular', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete circular "${title}"?`)) return;
    try {
      await smartCampusService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      addToast('Circular removed.', 'info');
    } catch (err) {
      addToast('Failed to delete announcement', 'error');
    }
  };

  const filtered = announcements.filter(a =>
    !search ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Notice Board & Circular Publishing
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Broadcast institutional circulars, critical exam alerts, and department bulletins
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Publish Notice</span>
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
          placeholder="Search circulars, notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading circulars...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Megaphone size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No announcements found</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title & Notice</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Target Dept</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {a.isPinned && <Pin size={12} color="#6366f1" />}
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.content}
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
                        {a.category}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: a.priority === 'URGENT' ? 'rgba(239, 68, 68, 0.15)' : a.priority === 'IMPORTANT' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                        color: a.priority === 'URGENT' ? '#ef4444' : a.priority === 'IMPORTANT' ? '#f59e0b' : '#6366f1',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {a.priority}
                      </span>
                    </td>
                    <td>{a.targetDepartment || 'All Departments'}</td>
                    <td>{a.publishDate}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(a.id, a.title)}
                        title="Delete notice"
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

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Publish Institutional Notice
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Notice Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Exams Oct 2026"
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
                    <option value="GENERAL">GENERAL</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="EXAM">EXAM</option>
                    <option value="PLACEMENT">PLACEMENT</option>
                    <option value="FEE">FEE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="IMPORTANT">IMPORTANT</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Target Department (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for All"
                    value={form.targetDepartment}
                    onChange={(e) => setForm({ ...form, targetDepartment: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={form.isPinned}
                    onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  />
                  <label htmlFor="isPinned" style={{ fontSize: '0.84rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    Pin to top of board
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Notice Text / Directive
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail institutional directives, timings, requirements, or hall guidelines..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
