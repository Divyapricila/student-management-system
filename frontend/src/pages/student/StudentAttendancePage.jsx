import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Layers,
  Award,
  AlertCircle,
  Calculator,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentAttendancePage({ initialSemester = 5, onShowToast }) {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const data = await smartCampusService.getAttendanceAnalysis(selectedSemester);
        if (isMounted) setAnalysisData(data);
      } catch (err) {
        if (isMounted) onShowToast(err.message || 'Error loading attendance analysis', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAttendance();
    return () => { isMounted = false; };
  }, [selectedSemester]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const overallPercentage = analysisData?.overallPercentage || 0;
  const subjects = analysisData?.subjects || [];

  return (
    <div className="attendance-page">
      {/* Controls & Semester Selector */}
      <div className="academic-controls-card shadow-sm">
        <div className="controls-left">
          <label className="select-label" htmlFor="semester-select">
            <Layers size={18} />
            <span>Select Semester:</span>
          </label>
          <div className="select-wrapper">
            <select
              id="semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="styled-select"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem} {sem === 5 ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="controls-right">
          <span className="badge-pill">Mandatory University Criteria: 75%</span>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-container" style={{ marginTop: '1.5rem' }}>
          <div className="skeleton-card" style={{ height: '140px', marginBottom: '1.5rem' }}></div>
          <div className="skeleton-card" style={{ height: '350px' }}></div>
        </div>
      ) : (
        <>
          {/* Smart Attendance Analyzer Alert Box */}
          <div className={`smart-attendance-banner shadow-sm ${overallPercentage >= 75 ? 'banner-good' : 'banner-warning'}`}>
            <div className="banner-icon-wrap">
              {overallPercentage >= 75 ? (
                <CheckCircle size={32} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={32} className="text-rose-500" />
              )}
            </div>
            <div className="banner-content">
              <div className="banner-title-row">
                <h4 className="banner-title">
                  {overallPercentage >= 75 ? 'Good Standing' : 'Attendance Shortage Alert'}
                </h4>
                <span className="banner-pill">
                  {overallPercentage >= 75 ? 'Eligible for Exams' : 'Action Required'}
                </span>
              </div>
              <p className="banner-desc">{analysisData?.message}</p>
              
              <div className="analyzer-metrics-row">
                <div className="analyzer-metric-item">
                  <span className="label">Present Classes</span>
                  <span className="val text-emerald-600">{analysisData?.presentClasses} / {analysisData?.totalClasses}</span>
                </div>
                <div className="analyzer-metric-item">
                  <span className="label">Absent Classes</span>
                  <span className="val text-rose-500">{analysisData?.absentClasses}</span>
                </div>
                {analysisData?.classesCanMissAbove75 > 0 && (
                  <div className="analyzer-metric-item highlight">
                    <span className="label">Safe Absence Buffer</span>
                    <span className="val text-blue-600">Up to {analysisData?.classesCanMissAbove75} classes</span>
                  </div>
                )}
                {analysisData?.classesNeededFor75 > 0 && (
                  <div className="analyzer-metric-item highlight-danger">
                    <span className="label">Required Recovery</span>
                    <span className="val text-rose-600">Attend {analysisData?.classesNeededFor75} consecutive classes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overall Attendance Summary Meter */}
          <div className="attendance-summary-card shadow-sm">
            <div className="summary-left">
              <div className="summary-title-group">
                <CalendarCheck2 size={24} className="text-indigo-600" />
                <div>
                  <h3 className="summary-heading">Overall Attendance</h3>
                  <p className="summary-sub">Semester {selectedSemester} Aggregation</p>
                </div>
              </div>
              <div className="overall-att-metric">{overallPercentage}%</div>
            </div>

            <div className="summary-right">
              <div className="progress-bar-large-wrap">
                <div className="progress-labels">
                  <span>Classroom Attendance</span>
                  <span className="font-semibold">{overallPercentage}%</span>
                </div>
                <div className="progress-track-large">
                  <div
                    className={`progress-fill-large ${overallPercentage >= 80 ? 'fill-good' : overallPercentage >= 75 ? 'fill-warning' : 'fill-danger'}`}
                    style={{ width: `${Math.min(100, overallPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Attendance Breakdown Table */}
          <div className="table-container shadow-sm">
            <div className="table-header-title">
              <h4>Subject-Wise Attendance Analyzer</h4>
              <span className="text-muted text-sm">{subjects.length} Subjects Evaluated</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Present</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Smart Advice</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-muted">
                        No attendance records found for Semester {selectedSemester}.
                      </td>
                    </tr>
                  ) : (
                    subjects.map((s, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="subject-code-badge">{s.subjectCode}</span>
                        </td>
                        <td className="font-medium">{s.subjectName}</td>
                        <td className="text-emerald-600 font-semibold">{s.presentClasses}</td>
                        <td>{s.totalClasses}</td>
                        <td>
                          <div className="table-progress-cell">
                            <span className="pct-text">{s.percentage}%</span>
                            <div className="table-progress-track">
                              <div
                                className={`table-progress-bar ${s.percentage >= 85 ? 'bar-good' : s.percentage >= 75 ? 'bar-warning' : 'bar-danger'}`}
                                style={{ width: `${Math.min(100, s.percentage)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${s.percentage >= 85 ? 'status-pill-good' : s.percentage >= 75 ? 'status-pill-warning' : 'status-pill-danger'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <span className="recommendation-text">{s.recommendation}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
