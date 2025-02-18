import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL if different

const apiService = {
  getCustomers: async (page, limit) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error; // Re-throw the error for handling in components
    }
  },

  getCustomerCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer count:', error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/customer`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      await axios.put(`${API_BASE_URL}/customer/${id}`, customerData);
      return;
    } catch (error) {
      console.error(`Error updating customer with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/customer/${id}`);
      return;
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  },
};

export default apiService;