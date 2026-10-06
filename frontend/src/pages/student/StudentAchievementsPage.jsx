import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Medal,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await smartCampusService.getAchievements();
        setAchievements(data || []);
      } catch (err) {
        console.error('Failed to load achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'HACKATHON':
        return <Trophy size={20} color="#f59e0b" />;
      case 'CERTIFICATION':
        return <Award size={20} color="#6366f1" />;
      case 'ACADEMIC':
        return <Medal size={20} color="#10b981" />;
      default:
        return <Sparkles size={20} color="#ec4899" />;
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Honors, Awards & Certifications
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Verified campus achievements, competitive hackathon recognitions, and micro-credentials
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {[1, 2, 3].map(k => (
            <div key={k} className="analytics-card" style={{ height: '180px', opacity: 0.6 }} />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="empty-state-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '1.5rem' }}>
          <Trophy size={38} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No achievements recorded yet</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Participate in campus hackathons, complete certifications, and excel academically to earn credentials.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {achievements.map((item) => (
            <div
              key={item.id}
              className="analytics-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.35rem',
                borderLeft: '4px solid #f59e0b',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getBadgeIcon(item.achievementType)}
                  </div>

                  <span style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {item.achievementType}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '0 0 0.45rem', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 1rem' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="#6366f1" />
                    <span>Issued by: <strong>{item.issuingOrganization}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#6366f1" />
                    <span>Conferred: {item.issueDate}</span>
                  </div>
                </div>
              </div>

              {item.certificateUrl && (
                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <a
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      color: '#6366f1',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
