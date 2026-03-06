import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL = BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const inventoryAPI = {

  // Maps to addFinished controller → POST /inventory/stock/finished/add
  addFinishedItem: async (itemData) => {
    const response = await axios.post(
      `${API_BASE_URL}/inventory/stock/finished/add`,
      itemData,
      getAuthHeader()
    );
    return response.data;
  },

  // GET /inventory/stock/finished/get
  getFinishedItems: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/stock/finished/get`,
      getAuthHeader()
    );
    return response.data;
  },

  // PUT /inventory/stock/finished/update/:itemId (updateData can be object or FormData for image)
  updateFinishedItem: async (itemId, updateData) => {
    const headers = { ...getAuthHeader().headers };
    if (updateData instanceof FormData) {
      delete headers["Content-Type"];
    }
    const response = await axios.put(
      `${API_BASE_URL}/inventory/stock/finished/update/${itemId}`,
      updateData,
      { headers }
    );
    return response.data;
  },

  // DELETE /inventory/stock/finished/delete/:itemId
  deleteFinishedItem: async (itemId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/inventory/stock/finished/delete/${itemId}`,
      getAuthHeader()
    );
    return response.data;
  },


  // POST /api/inventory/raw/add
  addRawItem: async (itemData) => {
    const response = await axios.post(
      `${API_BASE_URL}/inventory/raw/add`,
      itemData,
      getAuthHeader()
    );
    return response.data;
  },

  // GET /api/inventory/raw/:businessId
  getRawItems: async (businessId) => {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/raw/${businessId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // PUT /api/inventory/raw/:itemId
  updateRawItem: async (itemId, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/inventory/raw/${itemId}`,
      updateData,
      getAuthHeader()
    );
    return response.data;
  },

  // DELETE /api/inventory/raw/:itemId
  deleteRawItem: async (itemId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/inventory/raw/${itemId}`,
      getAuthHeader()
    );
    return response.data;
  }
};

export default inventoryAPI;