// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/erp/auth';

// Use in-memory storage instead of localStorage
let currentUser = null;

class AuthService {
  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    });

    if (response.data.token) {
      currentUser = response.data;
    }

    return response.data;
  }

  logout() {
    currentUser = null;
    window.location.href = '/login';
  }

  getCurrentUser() {
    return currentUser;
  }

  getToken() {
    return currentUser?.token;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    return currentUser?.role === role;
  }

  isAdmin() {
    return this.hasRole('ADMIN');
  }

  isHOD() {
    return this.hasRole('HOD');
  }
}

export default new AuthService();