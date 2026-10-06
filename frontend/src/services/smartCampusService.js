import api from './api';

const smartCampusService = {
  // Student Self-Service Endpoints
  getDashboardSummary: async () => {
    const res = await api.get('/student/me/dashboard-summary');
    return res.data.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/student/me/analytics');
    return res.data.data;
  },

  getAttendanceAnalysis: async (semester = null) => {
    const url = semester ? `/student/me/attendance-analysis?semester=${semester}` : '/student/me/attendance-analysis';
    const res = await api.get(url);
    return res.data.data;
  },

  getExams: async (semester = null) => {
    const url = semester ? `/student/me/exams?semester=${semester}` : '/student/me/exams';
    const res = await api.get(url);
    return res.data.data;
  },

  getAssignments: async (semester = null) => {
    const url = semester ? `/student/me/assignments?semester=${semester}` : '/student/me/assignments';
    const res = await api.get(url);
    return res.data.data;
  },

  submitAssignment: async (id, notes = '') => {
    const res = await api.post(`/student/me/assignments/${id}/submit`, { notes });
    return res.data.data;
  },

  getMaterials: async (semester = null) => {
    const url = semester ? `/student/me/materials?semester=${semester}` : '/student/me/materials';
    const res = await api.get(url);
    return res.data.data;
  },

  getNotifications: async () => {
    const res = await api.get('/student/me/notifications');
    return res.data.data;
  },

  markNotificationRead: async (id) => {
    const res = await api.put(`/student/me/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async () => {
    const res = await api.put('/student/me/notifications/read-all');
    return res.data;
  },

  getAnnouncements: async () => {
    const res = await api.get('/student/me/announcements');
    return res.data.data;
  },

  getFees: async () => {
    const res = await api.get('/student/me/fees');
    return res.data.data;
  },

  payFee: async (amount, method = 'UPI (Demo)') => {
    const res = await api.post('/student/me/fees/pay', { amount, method });
    return res.data.data;
  },

  getEvents: async () => {
    const res = await api.get('/student/me/events');
    return res.data.data;
  },

  registerEvent: async (id) => {
    const res = await api.post(`/student/me/events/${id}/register`);
    return res.data;
  },

  cancelEvent: async (id) => {
    const res = await api.delete(`/student/me/events/${id}/register`);
    return res.data;
  },

  getClubs: async () => {
    const res = await api.get('/student/me/clubs');
    return res.data.data;
  },

  joinClub: async (id) => {
    const res = await api.post(`/student/me/clubs/${id}/join`);
    return res.data;
  },

  leaveClub: async (id) => {
    const res = await api.delete(`/student/me/clubs/${id}/leave`);
    return res.data;
  },

  getAchievements: async () => {
    const res = await api.get('/student/me/achievements');
    return res.data.data;
  },

  globalSearchStudent: async (q) => {
    if (!q || q.trim().length < 2) return [];
    const res = await api.get(`/student/me/search?q=${encodeURIComponent(q)}`);
    return res.data.data;
  },

  // Admin Endpoints
  getAdminDashboardStats: async () => {
    const res = await api.get('/admin/dashboard-stats');
    return res.data.data;
  },

  getAtRiskStudents: async () => {
    const res = await api.get('/admin/at-risk');
    return res.data.data;
  },

  getStudentsPaginated: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/admin/students/paginated?${query}`);
    return res.data.data;
  },

  getAdminExams: async () => {
    const res = await api.get('/admin/exams');
    return res.data.data;
  },

  createExam: async (exam) => {
    const res = await api.post('/admin/exams', exam);
    return res.data.data;
  },

  deleteExam: async (id) => {
    const res = await api.delete(`/admin/exams/${id}`);
    return res.data;
  },

  getAdminAssignments: async () => {
    const res = await api.get('/admin/assignments');
    return res.data.data;
  },

  createAssignment: async (assignment) => {
    const res = await api.post('/admin/assignments', assignment);
    return res.data.data;
  },

  deleteAssignment: async (id) => {
    const res = await api.delete(`/admin/assignments/${id}`);
    return res.data;
  },

  getAdminMaterials: async () => {
    const res = await api.get('/admin/materials');
    return res.data.data;
  },

  createMaterial: async (material) => {
    const res = await api.post('/admin/materials', material);
    return res.data.data;
  },

  deleteMaterial: async (id) => {
    const res = await api.delete(`/admin/materials/${id}`);
    return res.data;
  },

  getAdminAnnouncements: async () => {
    const res = await api.get('/admin/announcements');
    return res.data.data;
  },

  createAnnouncement: async (announcement) => {
    const res = await api.post('/admin/announcements', announcement);
    return res.data.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await api.delete(`/admin/announcements/${id}`);
    return res.data;
  },

  getAdminEvents: async () => {
    const res = await api.get('/admin/events');
    return res.data.data;
  },

  createEvent: async (event) => {
    const res = await api.post('/admin/events', event);
    return res.data.data;
  },

  deleteEvent: async (id) => {
    const res = await api.delete(`/admin/events/${id}`);
    return res.data;
  },

  getAdminClubs: async () => {
    const res = await api.get('/admin/clubs');
    return res.data.data;
  },

  createClub: async (club) => {
    const res = await api.post('/admin/clubs', club);
    return res.data.data;
  },

  deleteClub: async (id) => {
    const res = await api.delete(`/admin/clubs/${id}`);
    return res.data;
  },

  getAuditLogs: async () => {
    const res = await api.get('/admin/audit-logs');
    return res.data.data;
  },

  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data.data;
  },

  updateSetting: async (setting) => {
    const res = await api.put('/admin/settings', setting);
    return res.data.data;
  },

  globalSearchAdmin: async (q) => {
    if (!q || q.trim().length < 2) return [];
    const res = await api.get(`/admin/search?q=${encodeURIComponent(q)}`);
    return res.data.data;
  },

  exportStudentsCsv: () => {
    window.open('http://localhost:8080/api/admin/reports/csv/students', '_blank');
  },

  exportAtRiskCsv: () => {
    window.open('http://localhost:8080/api/admin/reports/csv/at-risk', '_blank');
  }
};

export default smartCampusService;
