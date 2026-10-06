import api from './api';

/**
 * Service functions for Student REST API operations.
 */
const studentService = {
  /**
   * Fetch all students, optionally filtered by department.
   */
  async getAllStudents(department = '') {
    const params = department && department !== 'All' ? { department } : {};
    const response = await api.get('/students', { params });
    return response.data.data;
  },

  /**
   * Fetch a single student by primary key ID.
   */
  async getStudentById(id) {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },

  /**
   * Create a new student record.
   */
  async createStudent(studentData) {
    const response = await api.post('/students', studentData);
    return response.data.data;
  },

  /**
   * Update an existing student record.
   */
  async updateStudent(id, studentData) {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data.data;
  },

  /**
   * Delete a student by primary key ID.
   */
  async deleteStudent(id) {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  /**
   * Search students by keyword (matches studentId, name, department).
   */
  async searchStudents(keyword) {
    const response = await api.get('/students/search', {
      params: { keyword: keyword || '' },
    });
    return response.data.data;
  },

  /**
   * Fetch aggregate dashboard statistics.
   */
  async getDashboardStats() {
    const response = await api.get('/students/dashboard');
    return response.data.data;
  },

  /**
   * Check if a student ID is already taken.
   */
  async checkStudentId(studentId, excludeId = null) {
    const params = { studentId };
    if (excludeId) params.excludeId = excludeId;
    const response = await api.get('/students/check-id', { params });
    return response.data.data.available;
  },
};

export default studentService;
