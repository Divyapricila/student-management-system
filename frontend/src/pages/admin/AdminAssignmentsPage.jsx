import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  Search,
  Calendar,
  Award,
  X
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    subjectCode: '',
    description: '',
    dueDate: '',
    maxMarks: 100,
    semester: 5,
    department: 'ECE'
  });

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminAssignments();
      setAssignments(data || []);
    } catch (err) {
      console.error('Failed to load assignments', err);
      addToast('Could not load course assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createAssignment(form);
      setAssignments(prev => [...prev, created]);
      addToast(`Assignment "${form.title}" published!`, 'success');
      setShowAddModal(false);
      setForm({
        title: '',
        subjectCode: '',
        description: '',
        dueDate: '',
        maxMarks: 100,
        semester: 5,
        department: 'ECE'
      });
    } catch (err) {
      console.error('Create assignment error', err);
      addToast('Failed to create assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete assignment "${title}"?`)) return;
    try {
      await smartCampusService.deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
      addToast('Assignment removed.', 'info');
    } catch (err) {
      addToast('Failed to delete assignment', 'error');
    }
  };

  const filtered = assignments.filter(a =>
    !search ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    (a.department && a.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Course Assignment Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Publish term problem sets, laboratory briefs, and track student deadlines
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Publish Assignment</span>
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
          placeholder="Search by title, subject code, dept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading course assignments...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <FileCheck2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No assignments recorded</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Assignment Title</th>
                  <th>Subject Code</th>
                  <th>Dept & Sem</th>
                  <th>Due Date</th>
                  <th>Max Marks</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</span>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {a.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>{a.subjectCode}</span>
                    </td>
                    <td>{a.department || 'ALL'} • Sem {a.semester}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{a.dueDate}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>{a.maxMarks} pts</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(a.id, a.title)}
                        title="Delete assignment"
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

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Publish Course Assignment
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8086 Assembly Arithmetic Operations Problem Set"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="EC501"
                    value={form.subjectCode}
                    onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  >
                    <option value="ECE">ECE</option>
                    <option value="CSE">CSE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Max Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Description / Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the problems to solve, formatting rules, or GitHub repository requirements..."
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
                  {submitting ? 'Publishing...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
