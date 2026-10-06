import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import studentPortalService from '../../services/studentPortalService';

export default function FeedbackModal({ isOpen, onClose, onSuccess, onError }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      onError('Please enter your feedback comments.');
      return;
    }

    setSubmitting(true);
    try {
      await studentPortalService.submitFeedback({
        rating,
        message: message.trim(),
      });
      setMessage('');
      setRating(5);
      onSuccess('Thank you! Your feedback has been recorded successfully.');
      onClose();
    } catch (err) {
      onError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Share Your Feedback</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Help us improve your academic portal experience
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ textAlign: 'center', margin: '0.5rem 0 1.25rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                How was your experience?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: filled ? '#f59e0b' : '#cbd5e1',
                        transition: 'transform 150ms ease',
                      }}
                      title={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star size={28} fill={filled ? '#f59e0b' : 'none'} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="feedback-message">
                Your Comments & Suggestions
              </label>
              <textarea
                id="feedback-message"
                className="form-control"
                rows={4}
                placeholder="Share your thoughts about classes, features, portal usability, or improvements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
