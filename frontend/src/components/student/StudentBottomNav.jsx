import React from 'react';
import { LayoutDashboard, CalendarCheck2, CalendarDays, GraduationCap, User } from 'lucide-react';

export default function StudentBottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'marks', label: 'Marks', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
