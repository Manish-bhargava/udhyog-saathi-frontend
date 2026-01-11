// src/features/bills/api/index.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const billAPI = {
  // Create Pakka Bill
  createPakkaBill: async (billData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bill/create/pakka`, billData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating pakka bill:', error);
      throw error;
    }
  },

  // Get bills by type
  getBillsByType: async (type = 'pakka', page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bill/all`, {
        params: { type, page, limit },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  },

  // Search bills
  searchBills: async (searchTerm, type = 'pakka') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bill/search`, {
        params: { q: searchTerm, type },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching bills:', error);
      throw error;
    }
  }
};

export default billAPI;