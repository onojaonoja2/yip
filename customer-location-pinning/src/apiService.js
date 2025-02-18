import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL if different

const apiService = {
  getCustomers: async (page, limit, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error; // Re-throw the error for handling in components
    }
  },

  getCustomerCount: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/count`,{
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer count:', error);
      throw error;
    }
  },

  createCustomer: async (customerData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customer`, customerData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customerData, token) => {
    try {
      await axios.put(`${API_BASE_URL}/customer/${id}`, customerData, {
         headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the header
        },
      });
      return;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id, token) => {
    try {
      await axios.delete(`${API_BASE_URL}/customer/${id}`, {
         headers: {
          Authorization: `Bearer ${token}`, // Include JWT in the header
        },
      });
      return;
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
};

export default apiService;