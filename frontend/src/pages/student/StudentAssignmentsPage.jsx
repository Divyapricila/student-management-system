import React, { useState, useEffect } from 'react';
import { FileCheck2, Clock, CheckCircle2, AlertCircle, Upload, X, Send, Award, FileText } from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentAssignmentsPage({ onShowToast }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = () => {
    setLoading(true);
    smartCampusService.getAssignments()
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (onShowToast) onShowToast('Failed to load assignments', 'error');
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenSubmit = (assignment) => {
    setActiveModal(assignment);
    setSubmissionNotes('');
  };

  const handleSubmitSolution = async () => {
    if (!activeModal) return;
    setSubmitting(true);
    try {
      await smartCampusService.submitAssignment(activeModal.id, submissionNotes);
      if (onShowToast) onShowToast('Assignment submitted successfully!', 'success');
      setActiveModal(null);
      fetchAssignments();
    } catch (err) {
      if (onShowToast) onShowToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'PENDING') return a.status === 'PENDING';
    if (filter === 'SUBMITTED') return a.status === 'SUBMITTED';
    if (filter === 'OVERDUE') return a.status === 'OVERDUE';
    return true;
  });

  return (
    <div className="assignments-page">
      {/* Filter Tabs */}
      <div className="tab-pills-row shadow-sm">
        <button
          className={`tab-pill ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Assignments ({assignments.length})
        </button>
        <button
          className={`tab-pill ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending / Upcoming ({assignments.filter(a => a.status === 'PENDING').length})
        </button>
        <button
          className={`tab-pill ${filter === 'SUBMITTED' ? 'active' : ''}`}
          onClick={() => setFilter('SUBMITTED')}
        >
          Completed ({assignments.filter(a => a.status === 'SUBMITTED').length})
        </button>
        <button
          className={`tab-pill ${filter === 'OVERDUE' ? 'active' : ''}`}
          onClick={() => setFilter('OVERDUE')}
        >
          Overdue ({assignments.filter(a => a.status === 'OVERDUE').length})
        </button>
      </div>

      {loading ? (
        <div className="grid-2-col" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="skeleton-card" style={{ height: '220px' }}></div>
          <div className="skeleton-card" style={{ height: '220px' }}></div>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="empty-state-card shadow-sm">
          <FileCheck2 size={48} className="text-muted" />
          <h3>No Assignments in this section</h3>
          <p>Great job! You have no pending submissions here.</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((a) => {
            const isPending = a.status === 'PENDING';
            const isSubmitted = a.status === 'SUBMITTED';
            const isOverdue = a.status === 'OVERDUE';

            return (
              <div key={a.id} className="assignment-card shadow-sm">
                <div className="assignment-card-header">
                  <div>
                    <span className="subject-code-badge">{a.subjectCode}</span>
                    <span className="text-muted text-xs ml-2">{a.subjectName}</span>
                  </div>
                  <span className={`status-pill ${isSubmitted ? 'status-pill-good' : isOverdue ? 'status-pill-danger' : 'status-pill-warning'}`}>
                    {a.status}
                  </span>
                </div>

                <h4 className="assignment-title">{a.title}</h4>
                <p className="assignment-desc">{a.description}</p>

                <div className="assignment-meta-row">
                  <div className="meta-item">
                    <Clock size={14} className="text-muted" />
                    <span>Due: <strong>{a.dueDate}</strong></span>
                  </div>
                  <div className="meta-item">
                    <Award size={14} className="text-muted" />
                    <span>Max Marks: <strong>{a.maxMarks || 100}</strong></span>
                  </div>
                </div>

                {isSubmitted && (
                  <div className="submitted-banner">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-700">Submitted Solution Recorded</div>
                      {a.marksAwarded != null && (
                        <div className="text-xs text-muted">Awarded Marks: <strong>{a.marksAwarded} / {a.maxMarks || 100}</strong></div>
                      )}
                    </div>
                  </div>
                )}

                <div className="assignment-card-footer">
                  {isPending && (
                    <button
                      className="btn btn-primary btn-sm w-full"
                      onClick={() => handleOpenSubmit(a)}
                    >
                      <Upload size={14} />
                      <span>Submit Assignment</span>
                    </button>
                  )}
                  {isOverdue && (
                    <button
                      className="btn btn-secondary btn-sm w-full"
                      onClick={() => handleOpenSubmit(a)}
                    >
                      <Upload size={14} />
                      <span>Late Submission</span>
                    </button>
                  )}
                  {isSubmitted && (
                    <button
                      className="btn btn-secondary btn-sm w-full"
                      onClick={() => handleOpenSubmit(a)}
                    >
                      <FileText size={14} />
                      <span>View Submission</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal Dialog */}
      {activeModal && (
        <div className="modal-backdrop">
          <div className="modal-content shadow-xl max-w-lg">
            <div className="modal-header">
              <h3>Submit Solution: {activeModal.subjectCode}</h3>
              <button onClick={() => setActiveModal(null)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <h4 className="font-semibold text-base mb-1">{activeModal.title}</h4>
              <p className="text-sm text-muted mb-4">{activeModal.description}</p>

              {activeModal.status === 'SUBMITTED' && activeModal.submissionNotes && (
                <div className="bg-slate-50 p-3 rounded mb-3 text-sm">
                  <div className="text-xs font-semibold text-muted mb-1">Previous Submission Note:</div>
                  <div>{activeModal.submissionNotes}</div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Submission Notes / GitHub / Drive Link:</label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Paste your report link, GitHub repo, or solution notes here..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitSolution}
                disabled={submitting}
              >
                <Send size={15} />
                <span>{submitting ? 'Submitting...' : 'Confirm Submission'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
