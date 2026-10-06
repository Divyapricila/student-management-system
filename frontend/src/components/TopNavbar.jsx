import React, { useState, useEffect, useRef } from 'react';
import { Menu, Plus, RefreshCw, LogOut, ShieldCheck, User, Search, Bell, Moon, Sun, ArrowRight, BookOpen, Calendar, Award, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import smartCampusService from '../services/smartCampusService';

export default function TopNavbar({
  activeTab,
  role = 'ROLE_ADMIN',
  user,
  onToggleMenu,
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  onLogout,
  onNavigate
}) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch unread count for student
  useEffect(() => {
    if (role === 'ROLE_STUDENT') {
      smartCampusService.getNotifications()
        .then((notifs) => {
          const unread = notifs.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [role, activeTab]);

  // Handle live global search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        let results = [];
        if (role === 'ROLE_ADMIN') {
          results = await smartCampusService.globalSearchAdmin(searchQuery);
        } else {
          results = await smartCampusService.globalSearchStudent(searchQuery);
        }
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, role]);

  const handleSelectSearchResult = (result) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    if (onNavigate && result.url) {
      // url like /student/materials -> strip prefix
      const tab = result.url.replace(/^\/(student|admin)\//, '');
      onNavigate(tab);
    }
  };

  const getTitles = () => {
    const hr = new Date().getHours();
    const timeGreeting = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';

    if (role === 'ROLE_STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return {
            title: `${timeGreeting}, ${user?.studentName ? user.studentName.split(' ')[0] : 'Rahul'} 👋`,
            subtitle: 'Overview of your academic progress, classes, and smart campus metrics',
          };
        case 'analytics':
          return {
            title: 'Academic Performance Analytics',
            subtitle: 'Visual graphs of your semester SGPA trend, grade comparisons, and attendance curves',
          };
        case 'marks':
          return {
            title: 'My Academic Details',
            subtitle: 'Review semester marks, score breakdowns, and performance grades',
          };
        case 'attendance':
          return {
            title: 'Smart Attendance Analyzer',
            subtitle: 'Real-time attendance calculations and smart class attendance recommendations',
          };
        case 'exams':
          return {
            title: 'Examination Timetable & Seating',
            subtitle: 'View upcoming mid-terms, final theory exams, lab practicals, and seat numbers',
          };
        case 'assignments':
          return {
            title: 'Assignment Tracker',
            subtitle: 'Track pending homework, submit solutions, and review faculty evaluations',
          };
        case 'materials':
          return {
            title: 'Course Study Materials',
            subtitle: 'Download lecture notes, reference PDFs, and syllabus modules',
          };
        case 'fees':
          return {
            title: 'Fee Management & Receipts',
            subtitle: 'Review tuition breakdown, dues, transaction history, and demo payment receipts',
          };
        case 'events':
          return {
            title: 'Campus Events & Hackathons',
            subtitle: 'Explore upcoming technical fests, symposiums, and manage your registrations',
          };
        case 'clubs':
          return {
            title: 'Student Clubs & Societies',
            subtitle: 'Join technical, cultural, and sports clubs across the campus',
          };
        case 'announcements':
          return {
            title: 'Campus Notice Board',
            subtitle: 'Official broadcasts and urgent updates from the academic administration',
          };
        case 'achievements':
          return {
            title: 'Student Achievements & Honors',
            subtitle: 'Showcase of verified certifications, hackathons, and academic awards',
          };
        case 'calendar':
          return {
            title: 'Semester Academic Calendar',
            subtitle: 'Monthly schedule for class sessions, internal assessments, and exams',
          };
        case 'details':
          return {
            title: 'My Academic Records',
            subtitle: 'Comprehensive student registration and institutional details',
          };
        case 'profile':
          return {
            title: 'My Profile 2.0',
            subtitle: 'View enrollment details, guardian contacts, and profile completion status',
          };
        case 'change-password':
          return {
            title: 'Account Security',
            subtitle: 'Update your login password and manage account credentials',
          };
        case 'notifications':
          return {
            title: 'Notification Center',
            subtitle: 'Recent alerts regarding marks, exams, assignments, and campus notices',
          };
        default:
          return {
            title: 'Student Dashboard',
            subtitle: 'Welcome to your smart campus portal',
          };
      }
    }

    // Admin Titles
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Campus Analytics Dashboard 2.0',
          subtitle: 'Institutional KPIs, department statistics, CGPA charts, and risk monitoring',
        };
      case 'students':
        return {
          title: 'Student Records Directory',
          subtitle: 'Search, filter, sort, and manage student profiles with backend pagination',
        };
      case 'at-risk':
        return {
          title: 'At-Risk Student Detection',
          subtitle: 'Automated early warning system identifying attendance shortages and academic backlogs',
        };
      case 'academics':
        return {
          title: 'Marks & Attendance Management',
          subtitle: 'Record and update semester exam marks and classroom attendance',
        };
      case 'exams':
        return {
          title: 'Exam Schedule Management',
          subtitle: 'Schedule upcoming examinations, assign exam halls, and allocate seats',
        };
      case 'assignments':
        return {
          title: 'Course Assignments Manager',
          subtitle: 'Publish homework, problem sets, and evaluate student submissions',
        };
      case 'materials':
        return {
          title: 'Study Materials Repository',
          subtitle: 'Upload lecture notes, reference PDFs, and academic resources',
        };
      case 'announcements':
        return {
          title: 'Campus Announcements System',
          subtitle: 'Publish priority notices with department and year targeting',
        };
      case 'events':
        return {
          title: 'Campus Events & Registrations',
          subtitle: 'Coordinate college fests, workshops, and view registered student rosters',
        };
      case 'clubs':
        return {
          title: 'Student Clubs Management',
          subtitle: 'Oversee student societies, faculty coordinators, and active memberships',
        };
      case 'calendar':
        return {
          title: 'Semester Calendar Management',
          subtitle: 'Schedule upcoming examinations, workshops, holidays, and reviews',
        };
      case 'audit-logs':
        return {
          title: 'Security & Audit Logs',
          subtitle: 'Track administrative mutations, student modifications, and compliance actions',
        };
      case 'reports':
        return {
          title: 'Academic Reports & CSV Exports',
          subtitle: 'Institutional performance statistics, CSV downloads, and PDF print summaries',
        };
      case 'settings':
        return {
          title: 'System Settings & Rules',
          subtitle: 'Configure attendance thresholds, grading scales, and active academic year',
        };
      case 'feedbacks':
        return {
          title: 'Student Feedbacks',
          subtitle: 'Review feedback and rating submissions from enrolled students',
        };
      default:
        return {
          title: 'Smart Campus Admin Console',
          subtitle: 'College administration and academic operations platform',
        };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="mobile-menu-toggle"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div className="page-title-area">
          <h2 className="page-title">{title}</h2>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Global Search Bar */}
        <div className="global-search-container" ref={searchRef}>
          <div className="global-search-input-wrap">
            <Search size={16} className="global-search-icon" />
            <input
              type="text"
              placeholder={role === 'ROLE_ADMIN' ? 'Search students, depts, notices...' : 'Search subjects, notes, events...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchDropdown(true)}
              className="global-search-input"
            />
          </div>

          {showSearchDropdown && (
            <div className="global-search-dropdown shadow-lg">
              <div className="search-dropdown-header">
                <span>{isSearching ? 'Searching...' : `Results for "${searchQuery}"`}</span>
              </div>
              {searchResults.length === 0 && !isSearching ? (
                <div className="search-dropdown-empty">No matching records found</div>
              ) : (
                <div className="search-dropdown-list">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="search-dropdown-item"
                      onClick={() => handleSelectSearchResult(item)}
                    >
                      <div className="search-item-icon">
                        {item.type === 'material' && <BookOpen size={16} className="text-blue-500" />}
                        {item.type === 'exam' && <Calendar size={16} className="text-purple-500" />}
                        {item.type === 'event' && <Award size={16} className="text-amber-500" />}
                        {item.type === 'announcement' && <Bell size={16} className="text-rose-500" />}
                        {item.type === 'student' && <User size={16} className="text-emerald-500" />}
                        {!['material', 'exam', 'event', 'announcement', 'student'].includes(item.type) && <FileText size={16} />}
                      </div>
                      <div className="search-item-info">
                        <div className="search-item-title">{item.title}</div>
                        <div className="search-item-subtitle">{item.subtitle}</div>
                      </div>
                      <span className="search-item-badge">{item.category}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          className="btn-icon theme-toggle-btn"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon (For Student) */}
        {role === 'ROLE_STUDENT' && (
          <button
            className="btn-icon notification-bell-btn"
            onClick={() => onNavigate && onNavigate('notifications')}
            title="Notification Center"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge-counter">{unreadCount}</span>}
          </button>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh records from backend"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spinner' : ''} />
            <span className="hide-mobile">Refresh</span>
          </button>
        )}

        {/* Add Student Button (Admin) */}
        {role === 'ROLE_ADMIN' && onOpenAddModal && (
          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span className="hide-mobile">Add Student</span>
          </button>
        )}

        {/* User Profile Badge */}
        <div className="user-nav-badge">
          <div className="user-nav-avatar">
            {role === 'ROLE_ADMIN' ? <ShieldCheck size={16} /> : <User size={16} />}
          </div>
          <span className="user-nav-name hide-mobile">
            {user?.studentName || user?.username || (role === 'ROLE_ADMIN' ? 'Admin' : 'Student')}
          </span>
          <button
            className="btn-icon danger-hover"
            onClick={onLogout}
            title="Sign out of portal"
            style={{ padding: '4px', marginLeft: '4px', color: '#64748b' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
