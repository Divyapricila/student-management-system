import React from 'react';
import {
  FileText,
  Award,
  AlertTriangle,
  Building2,
  Users,
  TrendingUp,
  Printer
} from 'lucide-react';

export default function AdminReportsPage({ students = [], stats }) {
  // Sort toppers
  const toppers = [...students]
    .sort((a, b) => (b.marks || 0) - (a.marks || 0))
    .slice(0, 5);

  // Low attendance warning list (<75%)
  const lowAttendance = students.filter(
    (s) => s.attendancePercentage != null && s.attendancePercentage < 75.0
  );

  return (
    <div className="admin-reports-page">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">Institutional Academic Reports</h2>
          <p className="portal-page-subtitle">
            Comprehensive college analytics, department statistics, toppers, and attendance alerts
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => window.print()}
          title="Print official report"
        >
          <Printer size={15} />
          <span>Print Summary Report</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalStudents || students.length}</span>
            <span className="stat-label">Total Active Enrolled</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Building2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalDepartments || 6}</span>
            <span className="stat-label">Active Academic Branches</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.averageMarks || 84.5}%</span>
            <span className="stat-label">Institutional Mean CGPA</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats?.highestMarks || 96.5}%</span>
            <span className="stat-label">Institutional Highest</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Academic Toppers */}
        <div className="dashboard-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: '#d97706' }} />
              <span>Institutional Honor Roll (Top 5 Students)</span>
            </div>
            <span className="badge badge-success">Distinction</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {toppers.map((stu, idx) => (
              <div
                key={stu.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: idx === 0 ? '#fefce8' : '#f8fafc',
                  border: idx === 0 ? '1px solid #fef08a' : '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#f59e0b' : '#64748b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{stu.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {stu.studentId} • {stu.department} • Year {stu.year}
                    </div>
                  </div>
                </div>

                <span className="marks-badge marks-high" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {stu.marks}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Monitoring & Warnings */}
        <div className="dashboard-card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#ef4444' }} />
              <span>Attendance Condonation & Warnings (&lt;75%)</span>
            </div>
            <span className="badge badge-danger">{lowAttendance.length} At Risk</span>
          </div>

          {lowAttendance.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#16a34a' }}>
              <p style={{ fontWeight: 600 }}>All students currently meet the minimum 75% attendance criteria!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {lowAttendance.map((stu) => (
                <div
                  key={stu.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#b91c1c' }}>
                      {stu.name} ({stu.studentId})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {stu.department} • Year {stu.year} • Contact: {stu.contact}
                    </div>
                  </div>
                  <span className="badge badge-danger" style={{ fontWeight: 700 }}>
                    {stu.attendancePercentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
