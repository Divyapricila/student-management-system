import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  CalendarCheck2,
  CalendarDays,
  FileText,
  KeyRound,
  CreditCard,
  Clock,
  FileCheck2,
  TrendingUp,
  Award,
  ChevronRight,
  Megaphone,
  Sparkles,
  Users2,
  MessageSquare,
  ArrowRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Pin
} from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';
import FeedbackModal from '../../components/student/FeedbackModal';
import { useToast } from '../../context/ToastContext';

export default function StudentDashboardPage({
  profile,
  marksSummary,
  attendanceSummary,
  onNavigate,
  onShowToast
}) {
  const [summaryData, setSummaryData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summary, notifs, evts] = await Promise.all([
          smartCampusService.getDashboardSummary(),
          smartCampusService.getAnnouncements().catch(() => []),
          smartCampusService.getEvents().catch(() => [])
        ]);

        if (mounted) {
          setSummaryData(summary);
          setAnnouncements(notifs || []);
          setEvents(evts || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard details:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { mounted = false; };
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const studentName = profile?.name || summaryData?.studentName || 'Rahul Sharma';
  const firstName = studentName.split(' ')[0];
  const studentId = profile?.studentId || summaryData?.studentId || 'STU001';
  const department = profile?.department || summaryData?.department || 'ECE';
  const yearNumber = profile?.year || summaryData?.year || 3;
  const yearSuffix = yearNumber === 1 ? '1st' : yearNumber === 2 ? '2nd' : yearNumber === 3 ? '3rd' : `${yearNumber}th`;
  const yearString = `${yearSuffix} Year`;
  const semester = summaryData?.semester || profile?.semester || 5;

  const attendancePercentage = summaryData?.attendancePercentage != null
    ? summaryData.attendancePercentage
    : (attendanceSummary?.overallPercentage || profile?.attendancePercentage || 84.82);

  const currentSgpa = summaryData?.currentSgpa != null ? summaryData.currentSgpa : 8.42;
  const cgpa = summaryData?.cgpa != null ? summaryData.cgpa : 8.17;
  const feeDue = summaryData?.feeDue != null ? summaryData.feeDue : 15000;
  const pendingAssignments = summaryData?.pendingAssignmentsCount != null ? summaryData.pendingAssignmentsCount : 2;
  const nextExamDays = summaryData?.nextExamDays != null ? summaryData.nextExamDays : 8;
  const nextExamTitle = summaryData?.nextExamTitle || 'VLSI Design & Architecture';

  const recentAnnouncements = announcements.slice(0, 2);
  const featuredEvent = events[0] || null;

  return (
    <div className="student-dashboard fade-in">
      {/* 1. Header / Welcome Banner */}
      <div className="student-welcome-header">
        <div className="welcome-text-group">
          <h2 className="welcome-greeting">{getGreeting()}, {firstName} 👋</h2>
          <p className="welcome-subtext">Welcome to your student dashboard.</p>
        </div>

        <div className="student-meta-badges">
          <div className="meta-badge">
            <span className="meta-label">Student ID</span>
            <span className="meta-value">{studentId}</span>
          </div>
          <div className="meta-badge">
            <span className="meta-label">Department</span>
            <span className="meta-value">{department}</span>
          </div>
          <div className="meta-badge">
            <span className="meta-label">Academic Year</span>
            <span className="meta-value">{yearString}</span>
          </div>
          <div className="meta-badge highlight">
            <span className="meta-label">Current Semester</span>
            <span className="meta-value">Semester {semester}</span>
          </div>
          <div className="meta-badge" style={{ display: 'flex', justifyContent: 'center' }}>
            <span className="meta-label">Academic Status</span>
            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.82rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Academic Metrics / Dashboard Cards 2.0 */}
      <div className="section-block">
        <div className="section-header">
          <span className="section-title">Academic & Campus Status</span>
        </div>

        <div className="dashboard-kpis-grid">
          {/* Card 1: Attendance */}
          <div className="kpi-metric-card" onClick={() => onNavigate('attendance')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Attendance</span>
              <span className={`kpi-status-pill ${attendancePercentage >= 80 ? 'status-pill-good' : attendancePercentage >= 75 ? 'status-pill-warning' : 'status-pill-danger'}`}>
                {attendancePercentage >= 80 ? 'Good' : attendancePercentage >= 75 ? 'Warning' : 'Low'}
              </span>
            </div>
            <div className="kpi-metric-number">{attendancePercentage.toFixed(2)}%</div>
            <div className="kpi-progress-track">
              <div
                className={`kpi-progress-bar ${attendancePercentage >= 80 ? 'bar-good' : attendancePercentage >= 75 ? 'bar-warning' : 'bar-danger'}`}
                style={{ width: `${Math.min(100, attendancePercentage)}%` }}
              />
            </div>
            <div className="kpi-metric-sub">
              {attendancePercentage >= 75 ? 'Eligible for semester exams (≥75%)' : 'Caution: Below required 75% threshold'}
            </div>
          </div>

          {/* Card 2: Current SGPA */}
          <div className="kpi-metric-card" onClick={() => onNavigate('analytics')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Current SGPA</span>
              <TrendingUp size={16} color="#8b5cf6" />
            </div>
            <div className="kpi-metric-number" style={{ color: '#8b5cf6' }}>{currentSgpa.toFixed(2)}</div>
            <div className="kpi-metric-badge badge-purple">Semester {semester}</div>
            <div className="kpi-metric-sub">Grade Point: Distinction rating</div>
          </div>

          {/* Card 3: Cumulative CGPA */}
          <div className="kpi-metric-card" onClick={() => onNavigate('analytics')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Cumulative CGPA</span>
              <Award size={16} color="#3b82f6" />
            </div>
            <div className="kpi-metric-number" style={{ color: '#3b82f6' }}>{cgpa.toFixed(2)}</div>
            <div className="kpi-metric-badge badge-blue">Overall Cumulative</div>
            <div className="kpi-metric-sub">Top 15% in Department</div>
          </div>

          {/* Card 4: Fee Due */}
          <div className="kpi-metric-card" onClick={() => onNavigate('fees')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Fee Statement</span>
              <CreditCard size={16} color={feeDue > 0 ? '#f59e0b' : '#10b981'} />
            </div>
            <div className="kpi-metric-number" style={{ color: feeDue > 0 ? '#f59e0b' : '#10b981' }}>
              {feeDue > 0 ? `₹${feeDue.toLocaleString('en-IN')}` : '₹0 Cleared'}
            </div>
            <div className={`kpi-metric-badge ${feeDue > 0 ? 'badge-warning' : 'status-pill-good'}`}>
              {feeDue > 0 ? 'Due in 25 days' : 'All Dues Paid'}
            </div>
            <div className="kpi-metric-sub">
              {feeDue > 0 ? 'Tuition & laboratory access fees' : 'Zero outstanding balance'}
            </div>
          </div>

          {/* Card 5: Course Assignments */}
          <div className="kpi-metric-card" onClick={() => onNavigate('assignments')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Assignments</span>
              <FileCheck2 size={16} color="#6366f1" />
            </div>
            <div className="kpi-metric-number" style={{ color: '#6366f1' }}>
              {pendingAssignments} Pending
            </div>
            <div className="kpi-metric-badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
              Active Deadlines
            </div>
            <div className="kpi-metric-sub">Submit before due date to earn points</div>
          </div>

          {/* Card 6: Upcoming Exams */}
          <div className="kpi-metric-card" onClick={() => onNavigate('exams')}>
            <div className="kpi-metric-header">
              <span className="kpi-metric-title">Upcoming Exam</span>
              <Clock size={16} color="#ef4444" />
            </div>
            <div className="kpi-metric-number" style={{ color: '#ef4444' }}>
              In {nextExamDays} Days
            </div>
            <div className="kpi-metric-badge badge-danger">
              {nextExamTitle}
            </div>
            <div className="kpi-metric-sub">Hall Room A-101 • 10:00 AM</div>
          </div>
        </div>
      </div>

      {/* 3. Quick Access (6 Soft Pastel Cards matching the Reference UI) */}
      <div className="section-block">
        <div className="section-header">
          <span className="section-title">QUICK ACCESS</span>
          <span className="section-subtitle">Common student portals and record management tools</span>
        </div>

        <div className="quick-access-grid">
          {/* Card 1: My Profile */}
          <div
            className="quick-card pastel-blue"
            onClick={() => onNavigate('profile')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap blue">
              <User size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">My Profile</div>
              <div className="quick-desc">View your personal & contact details</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>

          {/* Card 2: My Marks */}
          <div
            className="quick-card pastel-purple"
            onClick={() => onNavigate('marks')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap purple">
              <GraduationCap size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">My Marks</div>
              <div className="quick-desc">View semester results, credits & grades</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>

          {/* Card 3: Smart Attendance */}
          <div
            className="quick-card pastel-green"
            onClick={() => onNavigate('attendance')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap green">
              <CalendarCheck2 size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">Attendance</div>
              <div className="quick-desc">Check attendance & smart analyzer</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>

          {/* Card 4: Semester Calendar */}
          <div
            className="quick-card pastel-amber"
            onClick={() => onNavigate('calendar')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap amber">
              <CalendarDays size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">Semester Calendar</div>
              <div className="quick-desc">View lecture schedule, reviews & exams</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>

          {/* Card 5: My Details */}
          <div
            className="quick-card pastel-indigo"
            onClick={() => onNavigate('details')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap indigo">
              <FileText size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">My Details</div>
              <div className="quick-desc">Complete academic & guardian records</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>

          {/* Card 6: Change Password */}
          <div
            className="quick-card pastel-pink"
            onClick={() => onNavigate('change-password')}
            role="button"
            tabIndex={0}
          >
            <div className="quick-icon-wrap pink">
              <KeyRound size={22} />
            </div>
            <div className="quick-info">
              <div className="quick-title">Change Password</div>
              <div className="quick-desc">Update credentials & account security</div>
            </div>
            <ChevronRight size={18} className="quick-arrow" />
          </div>
        </div>
      </div>

      {/* 4. Campus Life & Live Bulletins Section */}
      <div className="dashboard-bottom-grid">
        {/* Left: Notice Board Feed */}
        <div className="essential-card" style={{ minHeight: 'auto' }}>
          <div className="essential-header" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Megaphone size={18} color="#6366f1" />
              <span className="essential-label" style={{ fontSize: '0.86rem', color: 'var(--text-main)', textTransform: 'none', fontWeight: 700 }}>
                Campus Notice Board
              </span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--primary)', padding: '2px 6px' }}
              onClick={() => onNavigate('announcements')}
            >
              View All Notices →
            </button>
          </div>

          {recentAnnouncements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>No active circulars at this moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-secondary)',
                    borderLeft: item.priority === 'URGENT' ? '3px solid #ef4444' : item.priority === 'IMPORTANT' ? '3px solid #f59e0b' : '3px solid #6366f1',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNavigate('announcements')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {item.isPinned && <Pin size={11} color="#6366f1" />}
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.priority === 'URGENT' ? '#ef4444' : item.priority === 'IMPORTANT' ? '#f59e0b' : '#6366f1' }}>
                        {item.priority}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {item.category}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.publishDate}</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Featured Campus Event & Feedback Tool */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Featured Event Card */}
          <div className="essential-card" style={{ minHeight: 'auto' }}>
            <div className="essential-header" style={{ marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#ec4899" />
                <span className="essential-label" style={{ fontSize: '0.86rem', color: 'var(--text-main)', textTransform: 'none', fontWeight: 700 }}>
                  Upcoming Campus Event
                </span>
              </div>
              <span className="kpi-status-pill status-pill-good">Active RSVP</span>
            </div>

            {featuredEvent ? (
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {featuredEvent.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  📅 {featuredEvent.eventDate} • 📍 {featuredEvent.venue}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {featuredEvent.registeredCount || 0} registered
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.76rem', padding: '0.3rem 0.7rem' }}
                    onClick={() => onNavigate('events')}
                  >
                    View Events →
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>No events scheduled right now.</p>
            )}
          </div>

          {/* Quick Feedback Bar */}
          <div
            className="tool-card"
            style={{ padding: '0.85rem 1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setFeedbackModalOpen(true)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <MessageSquare size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student Feedback Portal</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Submit feedback for faculty & courses</div>
              </div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmitSuccess={() => {
          if (onShowToast) {
            onShowToast('Feedback submitted successfully! Thank you for your feedback.', 'success');
          }
          addToast('Feedback recorded anonymously', 'success');
        }}
      />
    </div>
  );
}
