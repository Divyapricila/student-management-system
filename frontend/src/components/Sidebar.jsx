import React from 'react';
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  GraduationCap,
  Calendar,
  FileCheck2,
  BookOpen,
  Megaphone,
  Sparkles,
  Users2,
  CalendarDays,
  ShieldAlert,
  FileBarChart,
  Settings,
  MessageSquare,
  LogOut,
  X,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  isOpen,
  onClose,
  onLogout
}) {
  const handleNav = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  const navGroups = [
    {
      group: 'CORE DIRECTORY',
      items: [
        { id: 'dashboard', label: 'Dashboard 2.0', icon: LayoutDashboard },
        { id: 'students', label: 'All Students', icon: Users },
        { id: 'at-risk', label: 'At-Risk Students', icon: AlertTriangle, badge: 'Smart' },
      ]
    },
    {
      group: 'ACADEMIC OPS',
      items: [
        { id: 'academics', label: 'Marks & Attendance', icon: GraduationCap },
        { id: 'exams', label: 'Exam Schedules', icon: Calendar },
        { id: 'assignments', label: 'Course Assignments', icon: FileCheck2 },
        { id: 'materials', label: 'Study Materials', icon: BookOpen },
      ]
    },
    {
      group: 'CAMPUS ADMIN',
      items: [
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'events', label: 'Campus Events', icon: Sparkles },
        { id: 'clubs', label: 'Student Clubs', icon: Users2 },
        { id: 'calendar', label: 'Semester Calendar', icon: CalendarDays },
        { id: 'feedbacks', label: 'Student Feedbacks', icon: MessageSquare },
      ]
    },
    {
      group: 'SYSTEM & AUDIT',
      items: [
        { id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
        { id: 'reports', label: 'Reports & CSV', icon: FileBarChart },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div>
          <h1 className="brand-title">EduManage</h1>
          <p className="brand-sub">Admin Console</p>
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
                  {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.84rem' }}>Admin Console</div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>ROLE_ADMIN • System</div>
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
