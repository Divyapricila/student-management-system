import api from './api';

const studentPortalService = {
  /**
   * Fetch authenticated student profile
   */
  async getMyProfile() {
    const response = await api.get('/student/me/profile');
    return response.data.data;
  },

  /**
   * Fetch marks for authenticated student for selected semester
   */
  async getMyMarks(semester = null) {
    const params = semester ? { semester } : {};
    const response = await api.get('/student/me/marks', { params });
    return response.data.data;
  },

  /**
   * Fetch attendance for authenticated student for selected semester
   */
  async getMyAttendance(semester = null) {
    const params = semester ? { semester } : {};
    const response = await api.get('/student/me/attendance', { params });
    return response.data.data;
  },

  /**
   * Fetch calendar events for authenticated student
   */
  async getMyCalendar(semester = null) {
    const params = semester ? { semester } : {};
    const response = await api.get('/student/me/calendar', { params });
    return response.data.data;
  },

  /**
   * Update student password
   */
  async changePassword(data) {
    const response = await api.put('/student/me/password', data);
    return response.data;
  },

  /**
   * Submit student feedback
   */
  async submitFeedback(data) {
    const response = await api.post('/student/me/feedback', data);
    return response.data;
  },
};

export default studentPortalService;
