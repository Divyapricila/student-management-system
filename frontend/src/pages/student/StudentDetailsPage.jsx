import React from 'react';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Building2,
  Mail,
  Phone,
  Layers,
  Award,
  DollarSign,
  ShieldAlert
} from 'lucide-react';

export default function StudentDetailsPage({ profile }) {
  const studentName = profile?.name || 'Rahul Sharma';
  const studentId = profile?.studentId || 'STU001';
  const department = profile?.department || 'ECE';
  const year = profile?.year ? `${profile.year}${profile.year === 1 ? 'st' : profile.year === 2 ? 'nd' : profile.year === 3 ? 'rd' : 'th'} Year` : '3rd Year';
  const semester = profile?.semester || 5;
  const email = profile?.email || 'rahul.sharma@example.com';
  const contact = profile?.contact || '9876543210';
  const academicStatus = profile?.academicStatus || 'Active / Regular';
  const feeDues = profile?.feeDues != null ? `₹${profile.feeDues.toLocaleString('en-IN')}` : '₹1,35,000';
  const attendance = profile?.attendancePercentage != null ? `${profile.attendancePercentage}%` : '84.82%';

  return (
    <div className="details-page-container">
      {/* Header */}
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">My Details</h2>
          <p className="portal-page-subtitle">
            Complete institutional student record and administrative profile
          </p>
        </div>
      </div>

      <div className="dashboard-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            <span>Comprehensive Student Record Sheet</span>
          </div>
          <span className="badge badge-success">
            <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
            {academicStatus}
          </span>
        </div>

        <div className="details-table-wrapper">
          <table className="details-info-table">
            <tbody>
              <tr>
                <td className="info-cell-label">Student ID</td>
                <td className="info-cell-value bold" style={{ color: 'var(--primary)' }}>{studentId}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Full Name</td>
                <td className="info-cell-value bold">{studentName}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Department / Branch</td>
                <td className="info-cell-value">{department} (Electronics & Communication Engineering)</td>
              </tr>
              <tr>
                <td className="info-cell-label">Academic Year</td>
                <td className="info-cell-value">{year}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Current Semester</td>
                <td className="info-cell-value">Semester {semester}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Email Address</td>
                <td className="info-cell-value">{email}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Contact Number</td>
                <td className="info-cell-value">{contact}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Academic Status</td>
                <td className="info-cell-value">
                  <span className="badge badge-success">{academicStatus}</span>
                </td>
              </tr>
              <tr>
                <td className="info-cell-label">Overall Attendance</td>
                <td className="info-cell-value bold" style={{ color: '#16a34a' }}>{attendance}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Pending Institutional Fee</td>
                <td className="info-cell-value bold" style={{ color: '#d97706' }}>{feeDues}</td>
              </tr>
              <tr>
                <td className="info-cell-label">Program Degree</td>
                <td className="info-cell-value">Bachelor of Technology (B.Tech) - 4 Year Program</td>
              </tr>
              <tr>
                <td className="info-cell-label">Affiliated University</td>
                <td className="info-cell-value">State Technical University / Autonomous Institute</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
