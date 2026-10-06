import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Mail,
  User,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import { useToast } from '../../context/ToastContext';

export default function AdminAtRiskPage() {
  const [atRiskList, setAtRiskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW
  const [search, setSearch] = useState('');
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await smartCampusService.getAtRiskStudents();
      setAtRiskList(data || []);
    } catch (err) {
      console.error('Failed to load at-risk students', err);
      addToast('Could not load at-risk students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCsv = () => {
    smartCampusService.exportAtRiskCsv();
    addToast('Downloading At-Risk Students CSV Report...', 'info');
  };

  const filtered = atRiskList.filter(s => {
    const matchesRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case 'HIGH':
        return (
          <span style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <AlertTriangle size={13} /> CRITICAL
          </span>
        );
      case 'MEDIUM':
        return (
          <span style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            fontWeight: 700
          }}>
            MODERATE
          </span>
        );
      default:
        return (
          <span style={{
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: '#6366f1',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.74rem',
            fontWeight: 700
          }}>
            LOW
          </span>
        );
    }
  };

  return (
    <div className="analytics-container fade-in">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Smart Campus: At-Risk Student Intelligence
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
            Automated early-intervention detection based on attendance thresholds (&lt;75%), CGPA (&lt;6.0), and backlogs
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleExportCsv}
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Download size={16} />
          <span>Export At-Risk CSV</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
        <div className="analytics-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total At-Risk Detected</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', marginTop: '0.35rem' }}>
            {atRiskList.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Flagged for counseling
          </div>
        </div>

        <div className="analytics-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Critical / High Risk</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', marginTop: '0.35rem' }}>
            {atRiskList.filter(s => s.riskLevel === 'HIGH').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Immediate intervention
          </div>
        </div>

        <div className="analytics-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Moderate Risk</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>
            {atRiskList.filter(s => s.riskLevel === 'MEDIUM').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Academic monitoring
          </div>
        </div>

        <div className="analytics-card" style={{ borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Low Risk Watchlist</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366f1', marginTop: '0.35rem' }}>
            {atRiskList.filter(s => s.riskLevel === 'LOW').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Attendance border
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1.25rem 0',
        padding: '0.85rem 1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search student ID, name, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={15} color="var(--text-muted)" style={{ marginRight: '4px' }} />
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
            <button
              key={lvl}
              className={`pill-btn ${riskFilter === lvl ? 'active' : ''}`}
              onClick={() => setRiskFilter(lvl)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="analytics-card" style={{ padding: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Evaluating academic triggers and attendance trends...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>No students currently flagged in this category</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              All students in this filter meet satisfactory academic and attendance criteria.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Dept & Sem</th>
                  <th>Attendance %</th>
                  <th>CGPA</th>
                  <th>Failed Courses</th>
                  <th>Risk Level</th>
                  <th>Diagnosis / Reasons</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.studentId}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6366f1', fontFamily: 'monospace' }}>{s.studentId}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.department}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sem {s.semester}</div>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: s.attendancePercentage < 75 ? '#ef4444' : '#f59e0b'
                      }}>
                        {s.attendancePercentage?.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        color: s.cgpa < 6.0 ? '#ef4444' : s.cgpa < 7.0 ? '#f59e0b' : '#10b981'
                      }}>
                        {s.cgpa?.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: s.failedSubjectsCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                        color: s.failedSubjectsCount > 0 ? '#ef4444' : '#10b981',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {s.failedSubjectsCount} Backlogs
                      </span>
                    </td>
                    <td>
                      {getRiskBadge(s.riskLevel)}
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        {s.riskReason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
