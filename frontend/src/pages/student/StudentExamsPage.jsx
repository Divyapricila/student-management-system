import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Hash, AlertCircle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentExamsPage({ onShowToast }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(5);

  useEffect(() => {
    let mounted = true;
    smartCampusService.getExams(selectedSemester)
      .then((data) => {
        if (mounted) {
          setExams(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoading(false);
          if (onShowToast) onShowToast('Failed to load exam timetable', 'error');
        }
      });
    return () => { mounted = false; };
  }, [selectedSemester]);

  return (
    <div className="exams-page">
      {/* Top Banner / Filter */}
      <div className="academic-controls-card shadow-sm">
        <div className="controls-left">
          <label className="select-label" htmlFor="exam-sem-select">
            <Layers size={18} />
            <span>Filter Semester:</span>
          </label>
          <div className="select-wrapper">
            <select
              id="exam-sem-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="styled-select"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s} {s === 5 ? '(Current)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="controls-right">
          <span className="badge-pill badge-purple">Carry Valid College ID Card to Exam Hall</span>
        </div>
      </div>

      {loading ? (
        <div className="grid-2-col" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="skeleton-card" style={{ height: '200px' }}></div>
          <div className="skeleton-card" style={{ height: '200px' }}></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="empty-state-card shadow-sm">
          <Calendar size={48} className="text-muted" />
          <h3>No Examinations Scheduled</h3>
          <p>No upcoming exams found for Semester {selectedSemester}.</p>
        </div>
      ) : (
        <div className="exams-grid">
          {exams.map((exam) => {
            const daysLeft = exam.daysRemaining != null ? exam.daysRemaining : 0;
            const isUrgent = daysLeft <= 10 && daysLeft >= 0;
            const isPassed = daysLeft < 0;

            return (
              <div key={exam.id} className="exam-schedule-card shadow-sm">
                <div className="exam-card-header">
                  <div>
                    <span className="subject-code-badge">{exam.subjectCode}</span>
                    <span className="exam-type-pill">{exam.examType}</span>
                  </div>
                  <div className={`countdown-badge ${isPassed ? 'badge-passed' : isUrgent ? 'badge-urgent' : 'badge-normal'}`}>
                    <Clock size={13} />
                    <span>
                      {isPassed ? 'Completed' : daysLeft === 0 ? 'Today!' : `In ${daysLeft} days`}
                    </span>
                  </div>
                </div>

                <h4 className="exam-subject-name">{exam.subjectName}</h4>

                <div className="exam-details-grid">
                  <div className="exam-detail-item">
                    <Calendar size={15} className="detail-icon text-indigo-500" />
                    <div>
                      <span className="detail-label">Date</span>
                      <span className="detail-val">{exam.examDate}</span>
                    </div>
                  </div>

                  <div className="exam-detail-item">
                    <Clock size={15} className="detail-icon text-purple-500" />
                    <div>
                      <span className="detail-label">Timing</span>
                      <span className="detail-val">{exam.examTime}</span>
                    </div>
                  </div>

                  <div className="exam-detail-item">
                    <MapPin size={15} className="detail-icon text-rose-500" />
                    <div>
                      <span className="detail-label">Hall / Venue</span>
                      <span className="detail-val">{exam.room || 'Main Hall'}</span>
                    </div>
                  </div>

                  <div className="exam-detail-item">
                    <Hash size={15} className="detail-icon text-amber-500" />
                    <div>
                      <span className="detail-label">Seat Allocation</span>
                      <span className="detail-val font-semibold text-primary">{exam.seatNumber || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div className="exam-card-footer">
                  <span className="text-muted text-xs">Department of {exam.department || 'ECE'}</span>
                  <span className="badge-pill text-xs">Max Marks: 100</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
