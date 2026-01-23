import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const billAPI = {
  // Post to /create/pakka
  createPakkaBill: async (billData) => {
    const response = await axios.post(`${API_BASE_URL}/create/pakka`, billData, getAuthHeader());
    return response.data;
  },

  // Post to /create/kaccha
  createKachaBill: async (billData) => {
    const response = await axios.post(`${API_BASE_URL}/create/kaccha`, billData, getAuthHeader());
    return response.data;
  },

  // Get from /all?type=...
  getBillsByType: async (type) => {
    const response = await axios.get(`${API_BASE_URL}/all?type=${type}`, getAuthHeader());
    return response.data;
  }
};

export default billAPI;