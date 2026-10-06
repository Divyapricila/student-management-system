import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export default function StudentProfilePage({ profile, onNavigate }) {
  const studentName = profile?.name || 'Rahul Sharma';
  const studentId = profile?.studentId || 'STU001';
  const department = profile?.department || 'ECE';
  const year = profile?.year ? `${profile.year}${profile.year === 1 ? 'st' : profile.year === 2 ? 'nd' : profile.year === 3 ? 'rd' : 'th'} Year` : '3rd Year';
  const semester = profile?.semester || 5;
  const email = profile?.email || 'rahul.sharma@example.com';
  const contact = profile?.contact || '9876543210';
  const academicStatus = profile?.academicStatus || 'Active / Regular';
  const marks = profile?.marks != null ? `${profile.marks}%` : '84.17%';

  return (
    <div className="profile-page-container">
      {/* Page Header */}
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">My Profile</h2>
          <p className="portal-page-subtitle">
            Personal and institutional enrollment profile details
          </p>
        </div>
      </div>

      <div className="profile-card-layout">
        {/* Left Column: Avatar & Quick Info */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-large">
            <span>{studentName.charAt(0)}</span>
          </div>

          <h3 className="profile-name">{studentName}</h3>
          <span className="profile-id-badge">{studentId}</span>

          <div className="profile-status-chip">
            <span className="status-dot"></span>
            <span>{academicStatus}</span>
          </div>

          <div className="profile-quick-stats">
            <div className="quick-stat-item">
              <span className="label">Department</span>
              <span className="val">{department}</span>
            </div>
            <div className="quick-stat-item">
              <span className="label">Current Year</span>
              <span className="val">{year}</span>
            </div>
            <div className="quick-stat-item">
              <span className="label">Current Semester</span>
              <span className="val">Semester {semester}</span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: '1.25rem', justifyContent: 'center' }}
            onClick={() => onNavigate('change-password')}
          >
            <KeyRound size={15} />
            <span>Update Password</span>
          </button>
        </div>

        {/* Right Column: Detailed Field Cards */}
        <div className="profile-details-card">
          <div className="card-section-title">
            <User size={18} style={{ color: 'var(--primary)' }} />
            <span>Personal Information</span>
          </div>

          <div className="profile-fields-grid">
            <div className="profile-field-item">
              <span className="field-label">Full Name</span>
              <span className="field-value">{studentName}</span>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Student ID Number</span>
              <span className="field-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {studentId}
              </span>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Official Email Address</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                <span className="field-value">{email}</span>
              </div>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Contact Number</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                <span className="field-value">{contact}</span>
              </div>
            </div>
          </div>

          <div className="card-section-title" style={{ marginTop: '2rem' }}>
            <Building2 size={18} style={{ color: '#8b5cf6' }} />
            <span>Academic Affiliation</span>
          </div>

          <div className="profile-fields-grid">
            <div className="profile-field-item">
              <span className="field-label">Degree & Department</span>
              <span className="field-value">B.Tech - {department}</span>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Academic Year</span>
              <span className="field-value">{year}</span>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Semester Standing</span>
              <span className="field-value">Semester {semester}</span>
            </div>

            <div className="profile-field-item">
              <span className="field-label">Academic Standing / CGPA</span>
              <span className="field-value" style={{ color: '#16a34a', fontWeight: 700 }}>
                {marks}
              </span>
            </div>
          </div>

          <div className="student-profile-notice" style={{ marginTop: '2rem' }}>
            <ShieldCheck size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', color: '#15803d', margin: 0 }}>
              Identity verified. Institutional details are managed by the College Registrar. For corrections to name or registration, please contact Student Affairs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
