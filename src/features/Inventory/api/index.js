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

  // GET /inventory/stock/warehouse-summary — stock per warehouse (Inventory rows)
  getWarehouseStockSummary: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/stock/warehouse-summary`,
      getAuthHeader(),
    );
    return response.data;
  },

  // GET /inventory/stock/finished/get — optional { warehouseId } for per-location qty
  getFinishedItems: async (query = {}) => {
    const config = { ...getAuthHeader() };
    if (query && Object.keys(query).length > 0) {
      config.params = query;
    }
    const response = await axios.get(
      `${API_BASE_URL}/inventory/stock/finished/get`,
      config,
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


  // POST /inventory/stock/raw/add
  addRawItem: async (itemData) => {
    const headers = { ...getAuthHeader().headers };
    if (itemData instanceof FormData) {
      delete headers["Content-Type"];
    }
    const response = await axios.post(
      `${API_BASE_URL}/inventory/stock/raw/add`,
      itemData,
      { headers }
    );
    return response.data;
  },

  // GET /inventory/stock/raw/get
  getRawItems: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/stock/raw/get`,
      getAuthHeader()
    );
    return response.data;
  },

  // PUT /inventory/stock/raw/update/:itemId
  updateRawItem: async (itemId, updateData) => {
    const headers = { ...getAuthHeader().headers };
    if (updateData instanceof FormData) {
      delete headers["Content-Type"];
    }
    const response = await axios.put(
      `${API_BASE_URL}/inventory/stock/raw/update/${itemId}`,
      updateData,
      { headers }
    );
    return response.data;
  },

  // DELETE /inventory/stock/raw/delete/:itemId
  deleteRawItem: async (itemId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/inventory/stock/raw/delete/${itemId}`,
      getAuthHeader()
    );
    return response.data;
  },

  // GET /inventory/warehouse/get
  getWarehouses: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/inventory/warehouse/get`,
      getAuthHeader()
    );
    return response.data;
  },

  // POST /inventory/warehouse/add
  addWarehouse: async (data) => {
    const response = await axios.post(
      `${API_BASE_URL}/inventory/warehouse/add`,
      data,
      getAuthHeader()
    );
    return response.data;
  },
};

export default inventoryAPI;
