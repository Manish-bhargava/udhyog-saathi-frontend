// // src/features/bills/api/index.js
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api/v1';

// const billAPI = {
//   // Create Pakka Bill
//   createPakkaBill: async (billData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/bill/create/pakka`, billData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating pakka bill:', error);
//       throw error;
//     }
//   },

//   // Get bills by type
//   getBillsByType: async (type = 'pakka', page = 1, limit = 20) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/bill/all`, {
//         params: { type, page, limit },
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching bills:', error);
//       throw error;
//     }
//   },

//   // Search bills
//   searchBills: async (searchTerm, type = 'pakka') => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/bill/search`, {
//         params: { q: searchTerm, type },
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error searching bills:', error);
//       throw error;
//     }
//   },

//   // Create Kacha Bill - REAL IMPLEMENTATION
//   createKachaBill: async (billData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/bill/create/kaccha`, billData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating kacha bill:', error);
//       throw error;
//     }
//   },

//   // Get Kacha Bills - REAL IMPLEMENTATION
//   getKachaBills: async (page = 1, limit = 20) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/bill/all`, {
//         params: { type: 'kaccha', page, limit },
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching kacha bills:', error);
//       throw error;
//     }
//   },

//   // Search Kacha Bills
//   searchKachaBills: async (searchTerm) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/bill/search`, {
//         params: { q: searchTerm, type: 'kaccha' },
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error searching kacha bills:', error);
//       throw error;
//     }
//   }
// };

// export default billAPI;



import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/bill';

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