import api from './api';

const academicAdminService = {
  /**
   * Get all semester numbers (1-8)
   */
  async getSemesters() {
    const response = await api.get('/admin/academics/semesters');
    return response.data.data;
  },

  /**
   * Get curriculum subjects for a given semester
   */
  async getSubjects(semester, department = '') {
    const params = { semester };
    if (department) params.department = department;
    const response = await api.get('/admin/academics/subjects', { params });
    return response.data.data;
  },

  /**
   * Get marks for a student and semester
   */
  async getStudentMarks(studentId, semester) {
    const response = await api.get('/admin/academics/marks', {
      params: { studentId, semester },
    });
    return response.data.data;
  },

  /**
   * Update student marks for a subject
   */
  async updateStudentMarks(data) {
    const response = await api.put('/admin/academics/marks', data);
    return response.data.data;
  },

  /**
   * Get attendance for a student and semester
   */
  async getStudentAttendance(studentId, semester) {
    const response = await api.get('/admin/academics/attendance', {
      params: { studentId, semester },
    });
    return response.data.data;
  },

  /**
   * Update student attendance for a subject
   */
  async updateStudentAttendance(data) {
    const response = await api.put('/admin/academics/attendance', data);
    return response.data.data;
  },

  /**
   * Get all calendar events
   */
  async getCalendarEvents() {
    const response = await api.get('/admin/academics/calendar');
    return response.data.data;
  },

  /**
   * Add new calendar event
   */
  async createCalendarEvent(data) {
    const response = await api.post('/admin/academics/calendar', data);
    return response.data.data;
  },

  /**
   * Delete calendar event
   */
  async deleteCalendarEvent(id) {
    const response = await api.delete(`/admin/academics/calendar/${id}`);
    return response.data;
  },

  /**
   * Get student feedbacks
   */
  async getFeedbacks() {
    const response = await api.get('/admin/feedbacks');
    return response.data.data;
  },
};

export default academicAdminService;
