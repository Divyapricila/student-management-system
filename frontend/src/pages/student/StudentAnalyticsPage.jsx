import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Award, BookOpen, CalendarCheck2, ArrowUpRight } from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentAnalyticsPage({ onShowToast }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    smartCampusService.getAnalytics()
      .then((data) => {
        if (mounted) {
          setAnalytics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoading(false);
          if (onShowToast) onShowToast('Failed to load analytics data', 'error');
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="skeleton-card" style={{ height: '140px', marginBottom: '1.5rem' }}></div>
        <div className="grid-2-col" style={{ gap: '1.5rem' }}>
          <div className="skeleton-card" style={{ height: '320px' }}></div>
          <div className="skeleton-card" style={{ height: '320px' }}></div>
        </div>
      </div>
    );
  }

  const sgpaData = analytics?.sgpaTrends?.map(item => ({
    name: `Sem ${item.semester}`,
    SGPA: item.sgpa,
    Percentage: item.percentage
  })) || [
    { name: 'Sem 1', SGPA: 7.8, Percentage: 78.5 },
    { name: 'Sem 2', SGPA: 8.1, Percentage: 80.8 },
    { name: 'Sem 3', SGPA: 8.3, Percentage: 82.4 },
    { name: 'Sem 4', SGPA: 8.0, Percentage: 79.8 },
    { name: 'Sem 5', SGPA: 8.95, Percentage: 84.17 },
  ];

  const subjectData = analytics?.currentSemesterSubjects?.map(s => ({
    name: s.subjectCode,
    subject: s.subjectName,
    Internal: s.internalMarks,
    External: s.externalMarks,
    Total: s.totalMarks
  })) || [];

  const attendanceData = analytics?.attendanceTrends?.map(a => ({
    name: `Sem ${a.semester}`,
    Attendance: a.percentage
  })) || [];

  return (
    <div className="analytics-page">
      {/* Top Overview Cards */}
      <div className="analytics-overview-row">
        <div className="analytics-stat-card">
          <div className="stat-card-icon icon-purple">
            <Award size={24} />
          </div>
          <div>
            <div className="stat-label">Cumulative CGPA</div>
            <div className="stat-number text-purple-600">{analytics?.overallCgpa?.toFixed(2) || '8.49'}</div>
            <div className="stat-sub">Out of 10.0 • Distinction Grade</div>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon icon-blue">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-label">Current Semester SGPA</div>
            <div className="stat-number text-blue-600">
              {sgpaData[sgpaData.length - 1]?.SGPA || '8.95'}
            </div>
            <div className="stat-sub text-emerald-600 flex items-center gap-1">
              <ArrowUpRight size={14} /> +0.95 improvement over Sem 4
            </div>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon icon-green">
            <CalendarCheck2 size={24} />
          </div>
          <div>
            <div className="stat-label">Average Attendance</div>
            <div className="stat-number text-emerald-600">86.2%</div>
            <div className="stat-sub">Consistently above 75% norm</div>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="stat-card-icon icon-amber">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-label">Credits Completed</div>
            <div className="stat-number text-amber-600">100 / 160</div>
            <div className="stat-sub">Semester 1 to 5 cleared</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Chart 1: SGPA Trend */}
        <div className="chart-panel shadow-sm">
          <div className="chart-panel-header">
            <h4>Semester SGPA Progression</h4>
            <span className="badge-pill">UGC 10-Point Scale</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={sgpaData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[0, 10]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    borderColor: 'var(--border-color, #cbd5e1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="SGPA" fill="#6366f1" radius={[6, 6, 0, 0]} name="SGPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Internal vs External Marks */}
        <div className="chart-panel shadow-sm">
          <div className="chart-panel-header">
            <h4>Subject Marks Breakdown (Semester 5)</h4>
            <span className="badge-pill">Internal (20) & External (80)</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={subjectData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    borderColor: 'var(--border-color, #cbd5e1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Internal" stackId="a" fill="#38bdf8" name="Internal (20)" />
                <Bar dataKey="External" stackId="a" fill="#818cf8" radius={[6, 6, 0, 0]} name="External (80)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Attendance Trend */}
        <div className="chart-panel shadow-sm">
          <div className="chart-panel-header">
            <h4>Semester Attendance Trajectory (%)</h4>
            <span className="badge-pill badge-green">Target: ≥ 75%</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={attendanceData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[60, 100]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    borderColor: 'var(--border-color, #cbd5e1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Attendance %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Overall Percentage Trend */}
        <div className="chart-panel shadow-sm">
          <div className="chart-panel-header">
            <h4>Academic Percentage (%) Curve</h4>
            <span className="badge-pill badge-purple">Continuous Evaluation</span>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={sgpaData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e2e8f0)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[60, 100]} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg, #ffffff)',
                    borderColor: 'var(--border-color, #cbd5e1)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Percentage" stroke="#ec4899" strokeWidth={3} dot={{ r: 5 }} name="Overall %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
