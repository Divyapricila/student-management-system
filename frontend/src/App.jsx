import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import ConfirmModal from './components/ConfirmModal';
import ToastNotification from './components/ToastNotification';
import { useToast } from './hooks/useToast';

// Auth & Services
import authService from './services/authService';
import studentService from './services/studentService';
import studentPortalService from './services/studentPortalService';

// Admin Pages
import LoginPage from './pages/LoginPage';
import AdminAcademicPage from './pages/admin/AdminAcademicPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import AdminFeedbacksPage from './pages/admin/AdminFeedbacksPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAtRiskPage from './pages/admin/AdminAtRiskPage';
import AdminExamsPage from './pages/admin/AdminExamsPage';
import AdminAssignmentsPage from './pages/admin/AdminAssignmentsPage';
import AdminMaterialsPage from './pages/admin/AdminMaterialsPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminClubsPage from './pages/admin/AdminClubsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Student Portal Pages & Components
import StudentSidebar from './components/student/StudentSidebar';
import StudentBottomNav from './components/student/StudentBottomNav';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentAnalyticsPage from './pages/student/StudentAnalyticsPage';
import StudentMarksPage from './pages/student/StudentMarksPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import StudentExamsPage from './pages/student/StudentExamsPage';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentMaterialsPage from './pages/student/StudentMaterialsPage';
import StudentFeesPage from './pages/student/StudentFeesPage';
import StudentEventsPage from './pages/student/StudentEventsPage';
import StudentClubsPage from './pages/student/StudentClubsPage';
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage';
import StudentAchievementsPage from './pages/student/StudentAchievementsPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';
import StudentCalendarPage from './pages/student/StudentCalendarPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentDetailsPage from './pages/student/StudentDetailsPage';
import ChangePasswordPage from './pages/student/ChangePasswordPage';

import './styles/App.css';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin Data states
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Admin Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Admin Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState('add');
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Student Data states
  const [studentProfile, setStudentProfile] = useState(null);
  const [studentMarksSummary, setStudentMarksSummary] = useState(null);
  const [studentAttendanceSummary, setStudentAttendanceSummary] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);

  // Toast notifications
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const handleShowToast = (msg, type = 'info') => {
    if (type === 'success') showSuccess(msg);
    else if (type === 'error') showError(msg);
    else showInfo(msg);
  };

  // Login Handler
  const handleLoginSuccess = (authData) => {
    setCurrentUser(authData);
    setActiveTab('dashboard');
    showSuccess(`Welcome back, ${authData.studentName || authData.username}!`);
  };

  // Logout Handler
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
    showInfo('You have signed out successfully.');
  };

  // Load Admin Data
  const fetchStats = useCallback(async () => {
    try {
      const data = await studentService.getDashboardStats();
      setStats(data);
      if (data && data.departments) {
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      let data;
      if (searchKeyword.trim()) {
        data = await studentService.searchStudents(searchKeyword.trim());
      } else {
        data = await studentService.getAllStudents(departmentFilter);
      }
      setStudents(data || []);
    } catch (err) {
      showError(err.message || 'Unable to connect to backend server.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchKeyword, departmentFilter, showError]);

  // Load Student Portal Data
  const fetchStudentData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'ROLE_STUDENT') return;
    try {
      setStudentLoading(true);
      const [profileData, marksData, attData] = await Promise.all([
        studentPortalService.getMyProfile(),
        studentPortalService.getMyMarks(),
        studentPortalService.getMyAttendance(),
      ]);
      setStudentProfile(profileData);
      setStudentMarksSummary(marksData);
      setStudentAttendanceSummary(attData);
    } catch (err) {
      console.error('Error loading student profile data:', err);
    } finally {
      setStudentLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser]);

  // Effect on user login change
  useEffect(() => {
    if (currentUser?.role === 'ROLE_ADMIN') {
      fetchStudents();
      fetchStats();
    } else if (currentUser?.role === 'ROLE_STUDENT') {
      fetchStudentData();
    }
  }, [currentUser, fetchStudents, fetchStats, fetchStudentData]);

  // Search debounce for Admin
  useEffect(() => {
    if (currentUser?.role === 'ROLE_ADMIN') {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [searchKeyword, departmentFilter, currentUser, fetchStudents]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (currentUser?.role === 'ROLE_ADMIN') {
      fetchStudents();
      fetchStats();
      showInfo('Refreshing records from server...');
    } else {
      fetchStudentData();
      showInfo('Refreshing student details...');
    }
  };

  // Admin Modals Handlers
  const handleOpenAddModal = () => {
    setFormModalMode('add');
    setSelectedStudentForEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setFormModalMode('edit');
    setSelectedStudentForEdit(student);
    setFormModalOpen(true);
  };

  const handleOpenDetailsModal = (student) => {
    setSelectedStudentForView(student);
    setDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (student) => {
    setSelectedStudentForDelete(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudentForDelete) return;
    setIsDeleting(true);
    try {
      await studentService.deleteStudent(selectedStudentForDelete.id);
      showSuccess(`Student ${selectedStudentForDelete.name} (${selectedStudentForDelete.studentId}) deleted successfully.`);
      setDeleteModalOpen(false);
      setSelectedStudentForDelete(null);
      fetchStudents();
      fetchStats();
    } catch (err) {
      showError(err.message || 'Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = (student, message) => {
    showSuccess(message);
    fetchStudents();
    fetchStats();
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setDepartmentFilter('');
    setYearFilter('');
  };

  // Render Login page if user is not authenticated
  if (!currentUser) {
    return (
      <>
        <ToastNotification toasts={toasts} onRemove={removeToast} />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  const isStudent = currentUser.role === 'ROLE_STUDENT';

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />

      {/* Sidebar (Role-dependent) */}
      {isStudent ? (
        <StudentSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
        />
      ) : (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddModal={handleOpenAddModal}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <TopNavbar
          activeTab={activeTab}
          role={currentUser.role}
          user={currentUser}
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          onOpenAddModal={handleOpenAddModal}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onLogout={handleLogout}
          onNavigate={setActiveTab}
        />

        <main className="content-area">
          {/* ================= STUDENT VIEWS ================= */}
          {isStudent && (
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboardPage
                  profile={studentProfile}
                  marksSummary={studentMarksSummary}
                  attendanceSummary={studentAttendanceSummary}
                  onNavigate={setActiveTab}
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'analytics' && (
                <StudentAnalyticsPage />
              )}
              {activeTab === 'marks' && (
                <StudentMarksPage
                  initialSemester={studentProfile?.semester || 5}
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'attendance' && (
                <StudentAttendancePage
                  initialSemester={studentProfile?.semester || 5}
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'exams' && (
                <StudentExamsPage />
              )}
              {activeTab === 'assignments' && (
                <StudentAssignmentsPage />
              )}
              {activeTab === 'materials' && (
                <StudentMaterialsPage />
              )}
              {activeTab === 'fees' && (
                <StudentFeesPage />
              )}
              {activeTab === 'events' && (
                <StudentEventsPage />
              )}
              {activeTab === 'clubs' && (
                <StudentClubsPage />
              )}
              {activeTab === 'announcements' && (
                <StudentAnnouncementsPage />
              )}
              {activeTab === 'achievements' && (
                <StudentAchievementsPage />
              )}
              {activeTab === 'notifications' && (
                <StudentNotificationsPage onNavigate={setActiveTab} />
              )}
              {activeTab === 'calendar' && (
                <StudentCalendarPage
                  initialSemester={studentProfile?.semester || 5}
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'profile' && (
                <StudentProfilePage
                  profile={studentProfile}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === 'details' && (
                <StudentDetailsPage
                  profile={studentProfile}
                />
              )}
              {activeTab === 'change-password' && (
                <ChangePasswordPage
                  onShowToast={handleShowToast}
                />
              )}
            </>
          )}

          {/* ================= ADMIN VIEWS ================= */}
          {!isStudent && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  stats={stats}
                  students={students}
                  isLoading={isLoading}
                  onNavigateToStudents={() => setActiveTab('students')}
                  onOpenAddModal={handleOpenAddModal}
                  onViewStudent={handleOpenDetailsModal}
                  onNavigateTab={setActiveTab}
                />
              )}
              {activeTab === 'students' && (
                <StudentsPage
                  students={students}
                  isLoading={isLoading}
                  searchKeyword={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  departmentFilter={departmentFilter}
                  onDepartmentChange={setDepartmentFilter}
                  yearFilter={yearFilter}
                  onYearChange={setYearFilter}
                  departments={departments}
                  onResetFilters={handleResetFilters}
                  onViewStudent={handleOpenDetailsModal}
                  onEditStudent={handleOpenEditModal}
                  onDeleteStudent={handleOpenDeleteModal}
                  onOpenAddModal={handleOpenAddModal}
                />
              )}
              {activeTab === 'at-risk' && (
                <AdminAtRiskPage />
              )}
              {activeTab === 'academics' && (
                <AdminAcademicPage
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'exams' && (
                <AdminExamsPage />
              )}
              {activeTab === 'assignments' && (
                <AdminAssignmentsPage />
              )}
              {activeTab === 'materials' && (
                <AdminMaterialsPage />
              )}
              {activeTab === 'announcements' && (
                <AdminAnnouncementsPage />
              )}
              {activeTab === 'events' && (
                <AdminEventsPage />
              )}
              {activeTab === 'clubs' && (
                <AdminClubsPage />
              )}
              {activeTab === 'calendar' && (
                <AdminCalendarPage
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'feedbacks' && (
                <AdminFeedbacksPage
                  onShowToast={handleShowToast}
                />
              )}
              {activeTab === 'audit-logs' && (
                <AdminAuditLogsPage />
              )}
              {activeTab === 'reports' && (
                <AdminReportsPage
                  students={students}
                  stats={stats}
                />
              )}
              {activeTab === 'settings' && (
                <AdminSettingsPage />
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation for Students */}
        {isStudent && (
          <StudentBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Admin Modals */}
      {!isStudent && (
        <>
          <StudentFormModal
            isOpen={formModalOpen}
            mode={formModalMode}
            initialData={selectedStudentForEdit}
            onClose={() => setFormModalOpen(false)}
            onSuccess={handleFormSuccess}
            onError={showError}
          />

          <StudentDetailsModal
            isOpen={detailsModalOpen}
            student={selectedStudentForView}
            onClose={() => setDetailsModalOpen(false)}
            onEdit={handleOpenEditModal}
          />

          <ConfirmModal
            isOpen={deleteModalOpen}
            title="Delete Student Record"
            message="Are you sure you want to permanently delete this student record from the system?"
            studentInfo={selectedStudentForDelete}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModalOpen(false)}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}
