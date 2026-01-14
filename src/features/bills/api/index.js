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
  },






  
  // NEW: Kacha Bill API Placeholders (mocked for now)
  createKachaBill: async (billData) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await axios.post(`${API_BASE_URL}/bill/create/kacha`, billData, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Mock response for development
      console.log('Mock Kacha Bill creation:', billData);
      return {
        success: true,
        data: {
          _id: Date.now().toString(),
          ...billData,
          type: 'kacha',
          createdAt: new Date().toISOString(),
          invoiceNumber: `KACHA-${Date.now().toString().slice(-6)}`,
          status: 'draft'
        },
        message: 'Kacha Bill created successfully (mock)'
      };
    } catch (error) {
      console.error('Error creating kacha bill:', error);
      throw error;
    }
  },

  getKachaBills: async (page = 1, limit = 20) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await axios.get(`${API_BASE_URL}/bill/kacha/all`, {
      //   params: { page, limit },
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Mock response for development
      return {
        success: true,
        data: getMockKachaBills(),
        pagination: {
          page,
          limit,
          total: 3,
          pages: 1
        }
      };
    } catch (error) {
      console.error('Error fetching kacha bills:', error);
      throw error;
    }
  }
};

// Helper function for mock data
const getMockKachaBills = () => {
  return [
    {
      _id: '1',
      invoiceNumber: 'KACHA-001',
      buyer: { 
        clientName: 'Local Vendor', 
        clientAddress: '123 Local Street, City' 
      },
      type: 'kacha',
      products: [
        { name: 'Product A', rate: 500, quantity: 10, amount: 5000 },
        { name: 'Product B', rate: 300, quantity: 5, amount: 1500 }
      ],
      subtotal: 6500,
      discount: 500,
      totalAmount: 6000,
      status: 'draft',
      createdAt: '2024-01-15',
      date: '2024-01-15'
    },
    {
      _id: '2',
      invoiceNumber: 'KACHA-002',
      buyer: { 
        clientName: 'Local Shop', 
        clientAddress: '456 Market Road, Town' 
      },
      type: 'kacha',
      products: [
        { name: 'Product C', rate: 200, quantity: 15, amount: 3000 }
      ],
      subtotal: 3000,
      discount: 0,
      totalAmount: 3000,
      status: 'pending',
      createdAt: '2024-01-16',
      date: '2024-01-16'
    },
    {
      _id: '3',
      invoiceNumber: 'KACHA-003',
      buyer: { 
        clientName: 'Small Business', 
        clientAddress: '789 Industrial Area, Village' 
      },
      type: 'kacha',
      products: [
        { name: 'Product D', rate: 1000, quantity: 3, amount: 3000 },
        { name: 'Product E', rate: 800, quantity: 2, amount: 1600 }
      ],
      subtotal: 4600,
      discount: 460,
      totalAmount: 4140,
      status: 'paid',
      createdAt: '2024-01-17',
      date: '2024-01-17'
    }
  ];
};

export default billAPI;