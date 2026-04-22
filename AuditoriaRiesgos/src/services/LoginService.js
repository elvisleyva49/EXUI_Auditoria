import axios from 'axios';

const API_URL = 'http://localhost:5500';

// Login function that calls the backend
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', response.data.user);
      return response.data;
    } else {
      throw new Error(response.data.message || 'Credenciales inválidas');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Error de conexión con el servidor');
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return token && user;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return { success: true };
};

export default {
  login,
  isAuthenticated,
  logout
};

