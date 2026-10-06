import React from 'react';
import {
  X,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Edit3,
  CheckCircle2
} from 'lucide-react';

export default function StudentDetailsModal({ isOpen, student, onClose, onEdit }) {
  if (!isOpen || !student) return null;

  const getGradeInfo = (marks) => {
    const m = Number(marks) || 0;
    if (m >= 85) return { grade: 'Distinction (A+)', color: '#059669', badgeClass: 'marks-high' };
    if (m >= 75) return { grade: 'First Class with Distinction (A)', color: '#059669', badgeClass: 'marks-high' };
    if (m >= 60) return { grade: 'First Class (B)', color: '#2563eb', badgeClass: 'marks-med' };
    if (m >= 50) return { grade: 'Second Class (C)', color: '#d97706', badgeClass: 'marks-avg' };
    if (m >= 40) return { grade: 'Pass Class (D)', color: '#d97706', badgeClass: 'marks-avg' };
    return { grade: 'Needs Improvement (F)', color: '#dc2626', badgeClass: 'marks-low' };
  };

  const gradeInfo = getGradeInfo(student.marks);

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Award size={20} style={{ color: 'var(--primary)' }} />
            <span>Student Profile Details</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Profile */}
          <div className="student-profile-header">
            <div className="avatar-large">{getInitials(student.name)}</div>
            <div className="profile-meta">
              <h3 className="profile-name">{student.name}</h3>
              <span className="profile-id">{student.studentId}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {student.department} • Year {student.year}
              </span>
            </div>
          </div>

          {/* Academic Performance Meter */}
          <div className="academic-performance-meter">
            <div className="performance-header">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Academic Score & Classification
              </span>
              <span className={`marks-badge ${gradeInfo.badgeClass}`}>
                {student.marks}% — {gradeInfo.grade}
              </span>
            </div>
            <div className="progress-track" style={{ height: '10px' }}>
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(Math.max(student.marks, 0), 100)}%`,
                  background:
                    student.marks >= 75
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : student.marks >= 50
                      ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                      : 'linear-gradient(90deg, #ef4444, #dc2626)',
                }}
              ></div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value">{student.department}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Academic Year</span>
              <span className="detail-value">Year {student.year}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <a
                href={`mailto:${student.email}`}
                className="detail-value"
                style={{ color: 'var(--primary)', wordBreak: 'break-all' }}
              >
                <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {student.email}
              </a>
            </div>

            <div className="detail-item">
              <span className="detail-label">Contact Number</span>
              <a
                href={`tel:${student.contact}`}
                className="detail-value"
                style={{ color: 'var(--primary)' }}
              >
                <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {student.contact}
              </a>
            </div>

            <div className="detail-item">
              <span className="detail-label">Record Created</span>
              <span className="detail-value" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {formatDate(student.createdAt)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Last Modified</span>
              <span className="detail-value" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {formatDate(student.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              onClose();
              onEdit(student);
            }}
          >
            <Edit3 size={15} />
            <span>Edit Information</span>
          </button>
        </div>
      </div>
    </div>
  );
}
