import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  ArrowRight,
  UserPlus,
  AlertTriangle,
  CalendarCheck2,
  DollarSign,
  GraduationCap,
  Sparkles,
  Megaphone,
  Calendar,
  FileCheck2,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import smartCampusService from '../services/smartCampusService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage({
  stats,
  students = [],
  isLoading,
  onNavigateToStudents,
  onOpenAddModal,
  onViewStudent,
  onNavigateTab
}) {
  const [adminStats, setAdminStats] = useState(null);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading2(true);
        const data = await smartCampusService.getAdminDashboardStats();
        setAdminStats(data);
      } catch (err) {
        console.error('Failed to load Dashboard 2.0 stats', err);
      } finally {
        setLoading2(false);
      }
    };
    fetchStats();
  }, []);

  const totalStudents = adminStats?.totalStudents ?? stats?.totalStudents ?? students.length;
  const totalDepartments = adminStats?.departmentsCount ?? stats?.totalDepartments ?? 0;
  const avgAttendance = adminStats?.averageAttendance ?? 81.2;
  const avgCgpa = adminStats?.averageCgpa ?? 8.05;
  const atRiskCount = adminStats?.atRiskCount ?? 0;
  const totalPendingFees = adminStats?.totalPendingFees ?? 0;

  // Chart data: Departments
  const deptData = adminStats?.studentsByDepartment
    ? Object.entries(adminStats.studentsByDepartment).map(([dept, count]) => ({ name: dept, count }))
    : Object.entries(stats?.studentsByDepartment || {}).map(([dept, count]) => ({ name: dept, count }));

  // Chart data: CGPA Distribution
  const cgpaData = adminStats?.cgpaDistribution
    ? Object.entries(adminStats.cgpaDistribution).map(([label, count]) => ({ name: label, count }))
    : [
        { name: 'Distinction (≥9.0)', count: 3 },
        { name: 'First Class (8.0-8.9)', count: 8 },
        { name: 'Second Class (7.0-7.9)', count: 3 },
        { name: 'Below Average (<7.0)', count: 1 }
      ];

  // Chart data: Attendance Distribution
  const attData = adminStats?.attendanceDistribution
    ? Object.entries(adminStats.attendanceDistribution).map(([label, count]) => ({ name: label, value: count }))
    : [
        { name: 'Good (≥80%)', value: 10 },
        { name: 'Warning (75-79%)', value: 3 },
        { name: 'Critical (<75%)', value: 2 }
      ];

  const ATT_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Top 4 performers
  const topStudents = [...students]
    .sort((a, b) => (b.marks || 0) - (a.marks || 0))
    .slice(0, 4);

  return (
    <div className="fade-in">
      {/* KPI Cards 2.0 */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-label">Total Enrolled Students</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Building2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalDepartments}</span>
            <span className="stat-label">Academic Departments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CalendarCheck2 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{avgAttendance?.toFixed(1)}%</span>
            <span className="stat-label">Avg Campus Attendance</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <GraduationCap size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{avgCgpa?.toFixed(2)}</span>
            <span className="stat-label">Campus Average CGPA</span>
          </div>
        </div>

        <div
          className="stat-card"
          style={{ cursor: 'pointer', borderLeft: atRiskCount > 0 ? '4px solid #ef4444' : undefined }}
          onClick={() => onNavigateTab && onNavigateTab('at-risk')}
          title="Click to view At-Risk details"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: atRiskCount > 0 ? '#ef4444' : undefined }}>{atRiskCount}</span>
            <span className="stat-label">At-Risk Students Flagged</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">₹{(totalPendingFees / 1000).toFixed(0)}k</span>
            <span className="stat-label">Pending Tuition Dues</span>
          </div>
        </div>
      </div>

      {/* Quick Ops Shortcuts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        margin: '1.25rem 0'
      }}>
        <button
          className="btn btn-secondary"
          onClick={onOpenAddModal}
          style={{ justifyContent: 'center', padding: '0.65rem', borderRadius: '10px' }}
        >
          <UserPlus size={16} color="#6366f1" />
          <span>Add Student</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => onNavigateTab && onNavigateTab('at-risk')}
          style={{ justifyContent: 'center', padding: '0.65rem', borderRadius: '10px', color: '#ef4444' }}
        >
          <AlertTriangle size={16} />
          <span>At-Risk Radar</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => onNavigateTab && onNavigateTab('exams')}
          style={{ justifyContent: 'center', padding: '0.65rem', borderRadius: '10px' }}
        >
          <Calendar size={16} color="#3b82f6" />
          <span>Exam Schedules</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => onNavigateTab && onNavigateTab('announcements')}
          style={{ justifyContent: 'center', padding: '0.65rem', borderRadius: '10px' }}
        >
          <Megaphone size={16} color="#f59e0b" />
          <span>Publish Notice</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => smartCampusService.exportStudentsCsv()}
          style={{ justifyContent: 'center', padding: '0.65rem', borderRadius: '10px' }}
        >
          <Download size={16} color="#10b981" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
        {/* Department Enrollment Bar Chart */}
        <div className="analytics-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Students by Department
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distribution</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CGPA Distribution */}
        <div className="analytics-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              CGPA Performance Tiers
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Campus Wide</span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Distribution Donut */}
        <div className="analytics-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Attendance Health Breakdown
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compliance</span>
          </div>

          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ATT_COLORS[index % ATT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {attData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ATT_COLORS[i] }} />
                <span>{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Academic Performers */}
        <div className="analytics-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Top Academic Performers
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>Honors</span>
          </div>

          {topStudents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No student records found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {topStudents.map((stu, idx) => (
                <div
                  key={stu.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onViewStudent && onViewStudent(stu)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#fef3c7' : '#e2e8f0',
                      color: idx === 0 ? '#b45309' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>{stu.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stu.department} • Year {stu.year}</div>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {stu.marks}%
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
