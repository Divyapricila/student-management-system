import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import studentPortalService from '../../services/studentPortalService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentMarksPage({ initialSemester = 5, onShowToast }) {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMarks = async () => {
      setLoading(true);
      try {
        const data = await studentPortalService.getMyMarks(selectedSemester);
        if (isMounted) setMarksData(data);
      } catch (err) {
        if (isMounted) onShowToast(err.message || 'Error loading marks', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMarks();
    return () => { isMounted = false; };
  }, [selectedSemester]);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const overallPercentage = marksData?.overallPercentage || 0;
  const overallGrade = marksData?.overallGrade || 'N/A';
  const subjects = marksData?.marks || [];

  return (
    <div className="marks-page-container">
      {/* Top Header Row with Title and Semester Selector */}
      <div className="page-header-row">
        <div>
          <h2 className="portal-page-title">My Academic Details</h2>
          <p className="portal-page-subtitle">
            Semester-wise performance, internal/external assessments, and final grades
          </p>
        </div>

        <div className="semester-selector-box">
          <label htmlFor="semester-select" className="selector-label">
            Select Semester
          </label>
          <select
            id="semester-select"
            className="form-control semester-dropdown"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem} {sem === 5 ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message={`Loading Semester ${selectedSemester} marks from database...`} />
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="marks-metrics-grid">
            <div className="metric-card pastel-green">
              <div className="metric-icon-wrap green">
                <Award size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-tag">Overall Percentage</span>
                <span className="metric-highlight">{overallPercentage}%</span>
                <span className="metric-note">Semester {selectedSemester} Aggregate</span>
              </div>
            </div>

            <div className="metric-card pastel-purple">
              <div className="metric-icon-wrap purple">
                <CheckCircle2 size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-tag">Overall Grade</span>
                <span className="metric-highlight">{overallGrade}</span>
                <span className="metric-note">First Class with Distinction</span>
              </div>
            </div>

            <div className="metric-card pastel-blue">
              <div className="metric-icon-wrap blue">
                <BookOpen size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-tag">Total Enrolled Subjects</span>
                <span className="metric-highlight">{subjects.length} Courses</span>
                <span className="metric-note">Theory & Practical Modules</span>
              </div>
            </div>

            <div className="metric-card pastel-amber">
              <div className="metric-icon-wrap amber">
                <Layers size={24} />
              </div>
              <div className="metric-content">
                <span className="metric-tag">Total Marks Scored</span>
                <span className="metric-highlight">
                  {marksData?.totalMarks || 0} / {marksData?.totalMaxMarks || subjects.length * 100}
                </span>
                <span className="metric-note">Internal + External Combined</span>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="table-card" style={{ marginTop: '1.5rem' }}>
            <div className="table-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  Semester {selectedSemester} - Grade Sheet
                </h3>
              </div>
              <span className="badge badge-success">Official Database Records</span>
            </div>

            {subjects.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} style={{ margin: '0 auto 0.75rem', color: '#94a3b8' }} />
                <p style={{ fontWeight: 500 }}>No marks published for Semester {selectedSemester} yet.</p>
                <p style={{ fontSize: '0.85rem' }}>Please select another semester or check back after grading completion.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Subject Code</th>
                      <th>Subject Name</th>
                      <th style={{ textAlign: 'center', width: '110px' }}>Internal</th>
                      <th style={{ textAlign: 'center', width: '110px' }}>External</th>
                      <th style={{ textAlign: 'center', width: '110px' }}>Total</th>
                      <th style={{ textAlign: 'center', width: '100px' }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((sub) => (
                      <tr key={sub.subjectCode}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {sub.subjectCode}
                        </td>
                        <td style={{ fontWeight: 500 }}>
                          {sub.subjectName}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="score-pill internal">{sub.internalMarks}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="score-pill external">{sub.externalMarks}</span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.96rem' }}>
                          {sub.totalMarks}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`grade-badge grade-${sub.grade?.toLowerCase() || 'a'}`}>
                            {sub.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                      <td colSpan={2} style={{ textAlign: 'right', paddingRight: '1rem' }}>
                        Cumulative Semester {selectedSemester} Result:
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {marksData?.totalInternal || 0}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        {marksData?.totalExternal || 0}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '1rem' }}>
                        {marksData?.totalMarks || 0}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="grade-badge grade-o">{overallGrade}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
