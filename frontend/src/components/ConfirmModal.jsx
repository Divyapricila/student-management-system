import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, studentInfo, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            <span>{title || 'Confirm Deletion'}</span>
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '1rem' }}>
            {message || 'Are you sure you want to permanently remove this student record?'}
          </p>

          {studentInfo && (
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Student ID:</span>
                <strong style={{ fontFamily: 'monospace' }}>{studentInfo.studentId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Name:</span>
                <strong>{studentInfo.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                <span>{studentInfo.department}</span>
              </div>
            </div>
          )}

          <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.85rem', fontWeight: 500 }}>
            * This action cannot be undone and will delete the record from MySQL.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
