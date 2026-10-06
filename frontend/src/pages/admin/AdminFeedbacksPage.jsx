import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User, Clock, AlertCircle } from 'lucide-react';
import academicAdminService from '../../services/academicAdminService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminFeedbacksPage({ onShowToast }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const list = await academicAdminService.getFeedbacks();
        setFeedbacks(list || []);
      } catch (err) {
        onShowToast('Error loading feedbacks: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-feedbacks-page">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">Student Feedback Submissions</h2>
          <p className="portal-page-subtitle">
            Student portal satisfaction reviews, suggestions, and academic feedback
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading student feedbacks..." />
      ) : feedbacks.length === 0 ? (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <AlertCircle size={40} style={{ margin: '0 auto 1rem', color: '#94a3b8' }} />
          <p style={{ fontWeight: 600 }}>No feedbacks submitted yet.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Feedbacks submitted by students from their dashboard will be listed here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {feedbacks.map((fb) => (
            <div key={fb.id} className="dashboard-card feedback-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#eff6ff',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {fb.studentName ? fb.studentName.charAt(0) : 'S'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 600 }}>{fb.studentName}</h4>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Student ID: {fb.studentRefId || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      size={14}
                      fill={st <= fb.rating ? '#f59e0b' : 'none'}
                      color={st <= fb.rating ? '#f59e0b' : '#cbd5e1'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '0.5rem 0' }}>
                "{fb.message}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                <Clock size={12} />
                <span>
                  {fb.createdAt ? new Date(fb.createdAt).toLocaleString() : 'Recently submitted'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
