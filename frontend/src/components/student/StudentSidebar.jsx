import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  CalendarCheck2,
  Calendar,
  FileCheck2,
  BookOpen,
  CreditCard,
  Sparkles,
  Users2,
  Megaphone,
  Trophy,
  CalendarDays,
  User,
  FileText,
  KeyRound,
  LogOut,
  X
} from 'lucide-react';

export default function StudentSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  user,
  onLogout
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  const navGroups = [
    {
      group: 'ACADEMICS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Academic Analytics', icon: BarChart3 },
        { id: 'marks', label: 'My Marks', icon: GraduationCap },
        { id: 'attendance', label: 'Smart Attendance', icon: CalendarCheck2 },
        { id: 'exams', label: 'Exam Timetable', icon: Calendar },
        { id: 'assignments', label: 'Assignments', icon: FileCheck2 },
      ]
    },
    {
      group: 'CAMPUS LIFE',
      items: [
        { id: 'materials', label: 'Study Materials', icon: BookOpen },
        { id: 'fees', label: 'Fee Payments', icon: CreditCard },
        { id: 'events', label: 'Campus Events', icon: Sparkles },
        { id: 'clubs', label: 'Student Clubs', icon: Users2 },
        { id: 'announcements', label: 'Notice Board', icon: Megaphone },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
      ]
    },
    {
      group: 'RECORDS & SECURITY',
      items: [
        { id: 'calendar', label: 'Semester Calendar', icon: CalendarDays },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'details', label: 'My Details', icon: FileText },
        { id: 'change-password', label: 'Change Password', icon: KeyRound },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="brand-title">EduManage</h1>
          <p className="brand-sub">Smart Campus</p>
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', color: '#94a3b8' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navGroups.map((grp, gIdx) => (
          <div key={gIdx} className="nav-group-section">
            <div className="nav-group-title">{grp.group}</div>
            {grp.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  data-tab={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="sidebar-footer" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {user?.studentName ? user.studentName.charAt(0) : 'S'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.studentName || 'Student'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.74rem' }}>
              {user?.studentId || 'STU001'} • {user?.department || 'ECE'}
            </div>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          onClick={onLogout}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
