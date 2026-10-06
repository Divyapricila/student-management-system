import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Search,
  Clock,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    subjectCode: '',
    subjectName: '',
    examType: 'Mid-Term Exam',
    examDate: '',
    examTime: '10:00 AM - 01:00 PM',
    room: 'Hall A-101',
    seatNumber: 'General',
    semester: 5,
    department: 'ECE'
  });

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminExams();
      setExams(data || []);
    } catch (err) {
      console.error('Failed to load exams', err);
      addToast('Could not load exam schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createExam(form);
      setExams(prev => [...prev, created]);
      addToast(`Exam scheduled for ${form.subjectName}!`, 'success');
      setShowAddModal(false);
      setForm({
        subjectCode: '',
        subjectName: '',
        examType: 'Mid-Term Exam',
        examDate: '',
        examTime: '10:00 AM - 01:00 PM',
        room: 'Hall A-101',
        seatNumber: 'General',
        semester: 5,
        department: 'ECE'
      });
    } catch (err) {
      console.error('Create exam error', err);
      addToast('Failed to schedule exam', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to cancel the exam schedule for "${name}"?`)) return;
    try {
      await smartCampusService.deleteExam(id);
      setExams(prev => prev.filter(e => e.id !== id));
      addToast(`Exam schedule removed.`, 'info');
    } catch (err) {
      addToast('Failed to delete exam', 'error');
    }
  };

  const filtered = exams.filter(e =>
    !search ||
    e.subjectName.toLowerCase().includes(search.toLowerCase()) ||
    e.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    (e.department && e.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Exam Timetable Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Schedule and publish mid-terms, final exams, seating arrangements, and hall venues
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Schedule New Exam</span>
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
          placeholder="Search by code, subject name, dept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading exam schedules...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No exam schedules found</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Dept & Sem</th>
                  <th>Exam Type</th>
                  <th>Date & Time</th>
                  <th>Hall Venue</th>
                  <th>Seat Rule</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ex => (
                  <tr key={ex.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ex.subjectName}</span>
                        <div style={{ fontSize: '0.74rem', color: '#6366f1', fontFamily: 'monospace' }}>{ex.subjectCode}</div>
                      </div>
                    </td>
                    <td>{ex.department || 'ALL'} • Sem {ex.semester}</td>
                    <td>
                      <span style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}>
                        {ex.examType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ex.examDate}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{ex.examTime}</div>
                    </td>
                    <td>{ex.room}</td>
                    <td>{ex.seatNumber || 'Assigned per Roll'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(ex.id, ex.subjectName)}
                        title="Cancel exam schedule"
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

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Schedule New Examination
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Code
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
                    Subject Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Microprocessors & Microcontrollers"
                    value={form.subjectName}
                    onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
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
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.examDate}
                    onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Timing
                  </label>
                  <input
                    type="text"
                    value={form.examTime}
                    onChange={(e) => setForm({ ...form, examTime: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Exam Type
                  </label>
                  <select
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  >
                    <option value="Mid-Term Exam">Mid-Term Exam</option>
                    <option value="Final Semester Exam">Final Semester Exam</option>
                    <option value="Practical Lab Exam">Practical Lab Exam</option>
                    <option value="Quiz Assessment">Quiz Assessment</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Scheduling...' : 'Save & Publish Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
