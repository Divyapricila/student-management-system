import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CalendarCheck2,
  Save,
  CheckCircle2,
  AlertCircle,
  User,
  BookOpen
} from 'lucide-react';
import academicAdminService from '../../services/academicAdminService';
import studentService from '../../services/studentService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminAcademicPage({ onShowToast }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('STU001');
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('ECS01');

  // Marks inputs
  const [internalMarks, setInternalMarks] = useState('');
  const [externalMarks, setExternalMarks] = useState('');

  // Attendance inputs
  const [presentClasses, setPresentClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingMarks, setSavingMarks] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Load students list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const list = await studentService.getAllStudents();
        setStudents(list || []);
        if (list && list.length > 0 && !selectedStudentId) {
          setSelectedStudentId(list[0].studentId);
        }
      } catch (err) {
        onShowToast('Error loading students: ' + err.message, 'error');
      }
    };
    fetchStudents();
  }, []);

  // Load subjects for semester
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subs = await academicAdminService.getSubjects(selectedSemester);
        setSubjects(subs || []);
        if (subs && subs.length > 0) {
          setSelectedSubjectCode(subs[0].code);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [selectedSemester]);

  // Load current values when student, semester or subject changes
  useEffect(() => {
    if (!selectedStudentId || !selectedSemester) return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const marksData = await academicAdminService.getStudentMarks(selectedStudentId, selectedSemester);
        const attData = await academicAdminService.getStudentAttendance(selectedStudentId, selectedSemester);

        if (isMounted) {
          // Find matching subject
          const currentMark = marksData?.marks?.find((m) => m.subjectCode === selectedSubjectCode);
          if (currentMark) {
            setInternalMarks(currentMark.internalMarks != null ? currentMark.internalMarks : '');
            setExternalMarks(currentMark.externalMarks != null ? currentMark.externalMarks : '');
          } else {
            setInternalMarks('');
            setExternalMarks('');
          }

          const currentAtt = attData?.subjects?.find((a) => a.subjectCode === selectedSubjectCode);
          if (currentAtt) {
            setPresentClasses(currentAtt.presentClasses != null ? currentAtt.presentClasses : '');
            setTotalClasses(currentAtt.totalClasses != null ? currentAtt.totalClasses : '');
          } else {
            setPresentClasses('');
            setTotalClasses('');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [selectedStudentId, selectedSemester, selectedSubjectCode]);

  // Save Marks
  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (internalMarks === '' || externalMarks === '') {
      onShowToast('Please specify internal and external marks.', 'error');
      return;
    }

    setSavingMarks(true);
    try {
      await academicAdminService.updateStudentMarks({
        studentId: selectedStudentId,
        semester: selectedSemester,
        subjectCode: selectedSubjectCode,
        internalMarks: Number(internalMarks),
        externalMarks: Number(externalMarks),
      });
      onShowToast(`Marks updated successfully for ${selectedSubjectCode}!`, 'success');
    } catch (err) {
      onShowToast(err.message || 'Failed to update marks.', 'error');
    } finally {
      setSavingMarks(false);
    }
  };

  // Save Attendance
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (presentClasses === '' || totalClasses === '') {
      onShowToast('Please specify present and total classes.', 'error');
      return;
    }

    setSavingAttendance(true);
    try {
      await academicAdminService.updateStudentAttendance({
        studentId: selectedStudentId,
        semester: selectedSemester,
        subjectCode: selectedSubjectCode,
        presentClasses: Number(presentClasses),
        totalClasses: Number(totalClasses),
      });
      onShowToast(`Attendance updated successfully for ${selectedSubjectCode}!`, 'success');
    } catch (err) {
      onShowToast(err.message || 'Failed to update attendance.', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

  const calculatedTotal = (Number(internalMarks) || 0) + (Number(externalMarks) || 0);
  const calculatedAttPct = Number(totalClasses) > 0
    ? Math.round(((Number(presentClasses) || 0) / Number(totalClasses)) * 1000) / 10
    : 0;

  return (
    <div className="admin-academic-page">
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="portal-page-title">Manage Academic Marks & Attendance</h2>
          <p className="portal-page-subtitle">
            Faculty & Admin portal for entering internal/external marks and lecture attendance
          </p>
        </div>
      </div>

      {/* Target Student and Semester Filter */}
      <div className="dashboard-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--primary)' }} />
            <span>Select Target Student, Semester & Subject</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-sel-student">
              Student Record
            </label>
            <select
              id="admin-sel-student"
              className="form-control"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map((stu) => (
                <option key={stu.id} value={stu.studentId}>
                  {stu.studentId} - {stu.name} ({stu.department})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-sel-semester">
              Semester
            </label>
            <select
              id="admin-sel-semester"
              className="form-control"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-sel-subject">
              Curriculum Subject
            </label>
            <select
              id="admin-sel-subject"
              className="form-control"
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.code}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching academic data for selected student..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Marks Management */}
          <div className="dashboard-card">
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} style={{ color: '#8b5cf6' }} />
                <span>Marks Management</span>
              </div>
              <span className="badge badge-purple">{selectedSubjectCode}</span>
            </div>

            <form onSubmit={handleSaveMarks}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="internal-input">
                    Internal Marks (Max 20/25)
                  </label>
                  <input
                    id="internal-input"
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    className="form-control"
                    placeholder="e.g. 16.0"
                    value={internalMarks}
                    onChange={(e) => setInternalMarks(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="external-input">
                    External Marks (Max 75/80)
                  </label>
                  <input
                    id="external-input"
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    className="form-control"
                    placeholder="e.g. 68.0"
                    value={externalMarks}
                    onChange={(e) => setExternalMarks(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Calculated Total Marks:</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {calculatedTotal} / 100
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={savingMarks}
              >
                {savingMarks ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Marks Record</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card 2: Attendance Management */}
          <div className="dashboard-card">
            <div className="card-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarCheck2 size={18} style={{ color: '#10b981' }} />
                <span>Attendance Management</span>
              </div>
              <span className="badge badge-success">{selectedSubjectCode}</span>
            </div>

            <form onSubmit={handleSaveAttendance}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="present-input">
                    Present Classes
                  </label>
                  <input
                    id="present-input"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="e.g. 42"
                    value={presentClasses}
                    onChange={(e) => setPresentClasses(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="total-input">
                    Total Classes Conducted
                  </label>
                  <input
                    id="total-input"
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="e.g. 48"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Attendance Percentage:</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: calculatedAttPct >= 75 ? '#16a34a' : '#d97706' }}>
                  {calculatedAttPct}%
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={savingAttendance}
              >
                {savingAttendance ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Attendance Record</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
