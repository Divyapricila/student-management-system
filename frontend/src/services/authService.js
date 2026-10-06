import api from './api';

const authService = {
  /**
   * Authenticate user with username/studentId and password
   */
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    const authData = response.data.data;
    if (authData && authData.token) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData));
    }
    return authData;
  },

  /**
   * Get current authenticated user details from local storage or server
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Get JWT token
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Check if current user has ADMIN role
   */
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ROLE_ADMIN';
  },

  /**
   * Check if current user has STUDENT role
   */
  isStudent() {
    const user = this.getUser();
    return user?.role === 'ROLE_STUDENT';
  },

  /**
   * Verify session with server
   */
  async getCurrentUserFromServer() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  /**
   * Logout user by clearing local session
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
