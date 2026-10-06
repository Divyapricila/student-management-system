import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: '',
    subjectCode: '',
    subjectName: '',
    fileType: 'PDF',
    fileUrl: 'https://example.com/materials/lecture-notes.pdf',
    fileSize: '4.2 MB',
    semester: 5,
    department: 'ECE',
    uploadedBy: 'Prof. Ramesh Gupta'
  });

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAdminMaterials();
      setMaterials(data || []);
    } catch (err) {
      console.error('Failed to load materials', err);
      addToast('Could not load study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const created = await smartCampusService.createMaterial(form);
      setMaterials(prev => [...prev, created]);
      addToast(`Uploaded "${form.title}"!`, 'success');
      setShowAddModal(false);
      setForm({
        title: '',
        subjectCode: '',
        subjectName: '',
        fileType: 'PDF',
        fileUrl: 'https://example.com/materials/notes.pdf',
        fileSize: '3.5 MB',
        semester: 5,
        department: 'ECE',
        uploadedBy: 'Prof. Ramesh Gupta'
      });
    } catch (err) {
      console.error('Upload error', err);
      addToast('Failed to upload material', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete syllabus document "${title}"?`)) return;
    try {
      await smartCampusService.deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      addToast('Material deleted.', 'info');
    } catch (err) {
      addToast('Failed to delete material', 'error');
    }
  };

  const filtered = materials.filter(m =>
    !search ||
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
    m.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Course Study Material Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Upload lecture slides, question banks, lab sheets, and syllabus guides
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Upload Material</span>
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
          placeholder="Search title, subject code, topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)', width: '100%' }}
        />
      </div>

      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading materials...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <BookOpen size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No study materials uploaded</h4>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Resource Title</th>
                  <th>Subject</th>
                  <th>Dept & Sem</th>
                  <th>Format / Size</th>
                  <th>Uploaded By</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.title}</span>
                        {m.fileUrl && (
                          <div style={{ fontSize: '0.75rem' }}>
                            <a href={m.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <ExternalLink size={11} /> Link
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>{m.subjectName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#6366f1', fontFamily: 'monospace' }}>{m.subjectCode}</div>
                    </td>
                    <td>{m.department || 'ALL'} • Sem {m.semester}</td>
                    <td>
                      <span style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 600
                      }}>
                        {m.fileType} • {m.fileSize}
                      </span>
                    </td>
                    <td>{m.uploadedBy}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(m.id, m.title)}
                        title="Delete resource"
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

      {/* Upload Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Upload Study Resource
              </h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Unit 1 - Semiconductor Physics Lecture Slides"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                />
              </div>

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
                    Subject Name
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
                    Format
                  </label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  >
                    <option value="PDF">PDF</option>
                    <option value="PPTX">PPTX</option>
                    <option value="DOCX">DOCX</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    File Size
                  </label>
                  <input
                    type="text"
                    value={form.fileSize}
                    onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Document Resource URL
                </label>
                <input
                  type="text"
                  required
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="form-control"
                  style={{ width: '100%', padding: '0.5rem 0.65rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Uploading...' : 'Upload & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
